'use client';

import React from 'react';
// import { Product } from './types'; // Ajustá la ruta si tenés tu tipo en otro archivo
import PropertiesCarousel from '@/components/ui/PropertyCarousel'

interface ToolMessagePropProps {
  propiedades: Product[];
}

const ToolMessageProp: React.FC<ToolMessagePropProps> = ({ propiedades }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Propiedades destacadas</h1>
      <PropertiesCarousel items={propiedades} />
    </div>
  );
};

export default ToolMessageProp;


export interface Product {
    agente: string;
    alrededores: string;
    banios: number;
    caracteristicas: string[];
    circunstancia: string;
    ciudad: string;
    cocina: string;
    codigo_postal: number;
    construccion_nueva: number;
    consumo_energia: number;
    direccion: string;
    dormitorios: number;
    emisiones: number;
    estado: string;
    estgen: string;
    fecha_alta: string;
    freq_precio: string;
    'geolocalizacion.latitude': number;
    'geolocalizacion.longitude': number;
    id: string | number; // Cambiado a string | number
    image_url: string;
    m2constr: number;
    m2terraza: number;
    m2utiles: number;
    moneda: string;
    nascensor: number;
    ntrasteros: number;
    num_inmueble: number | string; // Cambiado a number | string
    num_pisos_bloque: number | null; // Cambiado a number | null
    num_pisos_edificio: number | null; // Cambiado a number | null
    num_planta: string | null; // Cambiado a string | null
    num_terrazas: number | null; // Cambiado a number | null
    pais: string;
    piscina: number | null; // Cambiado a number | null
    precio: number | null; // Cambiado a number | null
    'propietario.apellido': string | null; // Cambiado a string | null
    'propietario.codigo': number | null; // Cambiado a number | null
    'propietario.comercial': string | null; // Cambiado a string | null
    'propietario.fecha_alta': string | null; // Cambiado a string | null
    'propietario.nombre': string | null; // Cambiado a string | null
    provincia: string;
    puerta?: any; // Se puede cambiar el tipo según sea necesario
    ref?: any; // Se puede cambiar el tipo según sea necesario
    'superficie.built'?: any; // Se puede cambiar el tipo según sea necesario
    'superficie.plot'?: any; // Se puede cambiar el tipo según sea necesario
    tipo: string;
    tipo_operacion: string;
    tipo_via: string;
    ubicacion: string;
    ventana: string;
    zona: string;
    url: string;
    [key: string]: any; // Permitir propiedades adicionales
  }