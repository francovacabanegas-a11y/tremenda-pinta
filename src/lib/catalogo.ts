import {
  CATEGORIAS as CATEGORIAS_DATA,
  MARCAS as MARCAS_DATA,
  PRODUCTOS as PRODUCTOS_DATA,
} from '@/data/productos.js'
import { WHATSAPP_NUMERO } from '@/data/config.js'

export type CategoriaId =
  | 'tees'
  | 'bottoms'
  | 'shorts'
  | 'hoodies'
  | 'workwear'
  | 'headwear'
  | 'accesorios'

export type Estado = 'Disponible' | 'Agotado'

export interface Producto {
  id: string
  nombre: string
  marca: string
  categoria: CategoriaId
  precio: number
  tallas: string[]
  estado: Estado
  descripcion: string
  imagen: string
  /** Fotos extra / ángulos (frente, espalda...). La primera es la portada. */
  imagenes?: Foto[]
}

export interface Foto {
  src: string
  /** Nombre del ángulo: "Frente", "Espalda", "Detalle"... */
  vista?: string
}

export interface Marca {
  nombre: string
  destacada?: boolean
}

export interface Categoria {
  id: CategoriaId
  etiqueta: string
}

export const PRODUCTOS = PRODUCTOS_DATA as Producto[]
export const MARCAS = MARCAS_DATA as Marca[]
export const CATEGORIAS = CATEGORIAS_DATA as Categoria[]

export const LOGO_SRC = '/img/logo-tremenda-pinta.png'

export function etiquetaCategoria(id: string) {
  return CATEGORIAS.find((c) => c.id === id)?.etiqueta ?? id
}

/**
 * Lista de fotos de una prenda: usa `imagenes` si existe; si no, `imagen`.
 * Devuelve [] cuando no hay foto (se muestra el placeholder).
 */
export function fotosProducto(p: Producto): Foto[] {
  const extra = (p.imagenes ?? []).filter((f) => f && f.src)
  if (extra.length > 0) return extra
  return p.imagen ? [{ src: p.imagen }] : []
}

/** "Bs. 1.250" — formato boliviano con punto de miles. */
export function formatoPrecio(precio: number) {
  return `Bs. ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(precio)}`
}

/**
 * Pasa imágenes locales por Netlify Image CDN (redimensiona y convierte a webp).
 * Las URLs blob:/data: (vista previa del admin) se devuelven tal cual.
 */
export function imagenCdn(src: string, width: number) {
  if (!src || !src.startsWith('/')) return src
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=80`
}

export function enlaceWhatsApp(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export function mensajePedido(p: Producto, talla?: string) {
  const lineas = [
    '¡Hola TREMENDA PINTA! 👋 Quiero pedir esta prenda:',
    '',
    `🧢 *${p.nombre}*`,
    `🏷️ Marca: ${p.marca}`,
    `📏 Talla: ${talla ?? 'por confirmar'}`,
    `💵 Precio: ${formatoPrecio(p.precio)}`,
  ]
  if (p.estado === 'Agotado') {
    lineas.push('', '¿Me avisan cuando vuelva a estar disponible?')
  } else {
    lineas.push('', '¿Está disponible?')
  }
  return lineas.join('\n')
}

/** Busca sin importar mayúsculas ni tildes. */
export function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}
