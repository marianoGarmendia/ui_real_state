import React, { useState, useEffect, useRef } from "react";
import { Product } from "./PropertyCard";

interface CarouselProps {
  items: Product[];
}

const PropertiesCarousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  // Ajustar items por página según ancho
  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerPage(3);
      else if (w >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
      setCurrentPage(0);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Desplazar track en cada cambio de página
  useEffect(() => {
    if (wrapperRef.current && trackRef.current) {
      const width = wrapperRef.current.clientWidth;
      trackRef.current.style.transform = `translateX(-${currentPage * width}px)`;
    }
  }, [currentPage, itemsPerPage, items.length]);

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, pageCount - 1));

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (touchDeltaX.current > 50) prevPage();
    else if (touchDeltaX.current < -50) nextPage();
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={wrapperRef}
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-300 ease-in-out"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((prop) => (
          <div
            key={prop.id}
            className="flex-shrink-0 px-2"
            style={{ width: `${100 / itemsPerPage}%` }}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl">
              <img
                src={
                  prop.image_url ??
                  "https://blog.wasi.co/wp-content/uploads/2019/07/claves-fotografia-inmobiliaria-exterior-casa-software-inmobiliario-wasi.jpg"
                }
                alt={prop.direccion}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <p className="mb-2 text-sm text-gray-600">
                  {prop.caracteristicas.join(", ")}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {prop.moneda}
                  {prop.precio}
                </p>
                <a
                  href={prop.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-500"
                >
                  Ver publicación
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className="absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow disabled:opacity-50"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={nextPage}
        disabled={currentPage === pageCount - 1}
        className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow disabled:opacity-50"
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Indicadores (dots) */}
      <div className="mt-2 flex justify-center space-x-1">
        {Array.from({ length: pageCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`h-2 w-2 rounded-full transition-colors ${
              idx === currentPage ? "bg-gray-800" : "bg-gray-300"
            }`}
            aria-label={`Página ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertiesCarousel;
