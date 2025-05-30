import { parsePartialJson } from "@langchain/core/output_parsers";
import { useRef, useEffect } from "react";
import { useStreamContext } from "@/providers/Stream";
import { AIMessage, Checkpoint, Message , } from "@langchain/langgraph-sdk";
import { getContentString } from "../utils";
import { BranchSwitcher, CommandBar } from "./shared";
import { MarkdownText } from "../markdown-text";
import { LoadExternalComponent, UIMessage } from "@langchain/langgraph-sdk/react-ui";
import { cn } from "@/lib/utils";
import { ToolCalls, ToolResult } from "./tool-calls";
import { MessageContentComplex } from "@langchain/core/messages";
import { Fragment } from "react/jsx-runtime";
import { isAgentInboxInterruptSchema } from "@/lib/agent-inbox-interrupt";
import { ThreadView } from "../agent-inbox";

import {useState} from "react";
import { GenericInterruptView } from "./generic-interrupt";

function CustomComponent({
  message,
  thread,
}: {
  message: Message;
  thread: ReturnType<typeof useStreamContext>;
}) {
 
  
  
  
  const { values } = useStreamContext();
  const customComponents = values.ui?.filter(
    (ui:UIMessage) =>{ 
     return  ui.metadata?.message_id === message.id
    }
  );
  
  // console.log("customComponents", customComponents);
  

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    // Función que busca <link rel="stylesheet"> en todos los shadowRoots hijos
    function patchCSSLinks() {
      const hosts = Array.from(wrapperRef.current!.children)
        .filter((el): el is HTMLElement => (el as HTMLElement).shadowRoot !== null)

      hosts.forEach(host => {
        const sr = host.shadowRoot!
        // parchea todos los <link> que empiecen por http://railway…
        sr.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach(link => {
          const href = link.getAttribute('href')
          if (href?.startsWith('http://apirealstate-production.up.railway.app')) {
            link.setAttribute('href', href.replace('http://', 'https://'))
          }
        })
      })
    }

    // parche inicial
    patchCSSLinks()

    // y observa dinámicamente nuevas inserciones en shadowRoots
    const observer = new MutationObserver(patchCSSLinks)
    // observa cada shadowRoot
    Array.from(wrapperRef.current.children)
      .forEach((el) => {
        const sr = (el as HTMLElement).shadowRoot
        if (sr) observer.observe(sr, { childList: true, subtree: true })
      })

    return () => observer.disconnect()
  }, [])
  
  
  if (!customComponents?.length) return null;
  return (
    <Fragment key={message.id}>
      {customComponents.map((customComponent:any) => (
        
        <LoadExternalComponent
        style={{ display: 'grid', width: '100%' }} 
          key={customComponent.id}
          stream={thread}
          message={customComponent }
          meta={{ ui: customComponent }}
          
        />
     
      ))}
    </Fragment>
  );
}

function parseAnthropicStreamedToolCalls(
  content: MessageContentComplex[],
): AIMessage["tool_calls"] {
  const toolCallContents = content.filter((c) => c.type === "tool_use" && c.id);

  return toolCallContents.map((tc) => {
    const toolCall = tc as Record<string, any>;
    let json: Record<string, any> = {};
    if (toolCall?.input) {
      try {
        json = parsePartialJson(toolCall.input) ?? {};
      } catch {
        // Pass
      }
    }
    return {
      name: toolCall.name ?? "",
      id: toolCall.id ?? "",
      args: json,
      type: "tool_call",
    };
  });
}

export function AssistantMessage({
  message,
  isLoading,
  handleRegenerate,
}: {
  message: Message | undefined;
  isLoading: boolean;
  handleRegenerate: (parentCheckpoint: Checkpoint | null | undefined) => void;
}) {
  const content = message?.content ?? [];
  const contentString = getContentString(content);
  // const [hideToolCalls] = useQueryState(
  //   "hideToolCalls",
  //   parseAsBoolean.withDefault(true),
  // );

  const [hideToolCalls] = useState(true)

  const thread = useStreamContext();
  const isLastMessage =
    thread.messages[thread.messages.length - 1].id === message?.id;
  const hasNoAIOrToolMessages = !thread.messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );
  const meta = message ? thread.getMessagesMetadata(message) : undefined;
  const threadInterrupt = thread.interrupt;

  const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;
  const anthropicStreamedToolCalls = Array.isArray(content)
    ? parseAnthropicStreamedToolCalls(content)
    : undefined;

  const hasToolCalls =
    message &&
    "tool_calls" in message &&
    message.tool_calls &&
    message.tool_calls.length > 0;
  const toolCallsHaveContents =
    hasToolCalls &&
    message.tool_calls?.some(
      (tc) => tc.args && Object.keys(tc.args).length > 0,
    );
  const hasAnthropicToolCalls = !!anthropicStreamedToolCalls?.length;
  const isToolResult = message?.type === "tool";
    
    
  if (isToolResult && hideToolCalls) {
    return null;
  }

  if (!message) return null;
  return (
    <div className="group mr-auto flex items-start gap-2">
      {isToolResult ? (
        <ToolResult message={message} />
      ) : (
        <div className="flex flex-col gap-2">
          {contentString.length > 0 && (
            <div className="py-1">
              <MarkdownText>{contentString}</MarkdownText>
            </div>
          )}

          {!hideToolCalls && (
            <>
              {(hasToolCalls && toolCallsHaveContents && (
                <ToolCalls toolCalls={message.tool_calls} />
              )) ||
                (hasAnthropicToolCalls && (
                  <ToolCalls toolCalls={anthropicStreamedToolCalls} />
                )) ||
                (hasToolCalls && <ToolCalls toolCalls={message.tool_calls} />)}
            </>
          )}

          {message && (
            <CustomComponent
              message={message}
              thread={thread}
            />
          )}
          {isAgentInboxInterruptSchema(threadInterrupt?.value) &&
            (isLastMessage || hasNoAIOrToolMessages) && (
              <ThreadView interrupt={threadInterrupt.value} />
            )}
          {threadInterrupt?.value &&
          !isAgentInboxInterruptSchema(threadInterrupt.value) &&
          isLastMessage ? (
            <GenericInterruptView interrupt={threadInterrupt.value} />
          ) : null}
          <div
            className={cn(
              "mr-auto flex items-center gap-2 transition-opacity",
              "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
            )}
          >
            <BranchSwitcher
              branch={meta?.branch}
              branchOptions={meta?.branchOptions}
              onSelect={(branch) => thread.setBranch(branch)}
              isLoading={isLoading}
            />
            <CommandBar
              content={contentString}
              isLoading={isLoading}
              isAiMessage={true}
              handleRegenerate={() => handleRegenerate(parentCheckpoint)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function AssistantMessageLoading() {
  return (
    <div className="mr-auto flex items-start gap-2">
      <div className="bg-muted flex h-8 items-center gap-1 rounded-2xl px-4 py-2">
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_0.5s_infinite] rounded-full"></div>
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_1s_infinite] rounded-full"></div>
      </div>
    </div>
  );
}
