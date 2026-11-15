import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fotosProducto, imagenCdn, type Producto } from '@/lib/catalogo'
import { ProductImage } from './product-image'

interface Props {
  producto: Producto
  /** Ancho pedido al Image CDN para la foto principal. */
  width?: number
  eager?: boolean
  /** Clases para la foto (ej. escala de grises si está agotada). */
  imageClassName?: string
  /** Muestra la fila de miniaturas con el nombre de cada vista (modal). */
  miniaturas?: boolean
  className?: string
  /** Contenido superpuesto sobre la foto (badges, degradados...). */
  children?: ReactNode
}

/**
 * Foto de la prenda con soporte para varios ángulos (frente, espalda...).
 * Con una sola foto se comporta igual que ProductImage. Con 2 o más muestra
 * flechas, puntos, deslizamiento táctil y, opcionalmente, miniaturas.
 */
export function ProductGallery({
  producto: p,
  width = 640,
  eager,
  imageClassName,
  miniaturas,
  className,
  children,
}: Props) {
  const fotos = fotosProducto(p)
  const total = fotos.length
  const [indice, setIndice] = useState(0)
  const actual = Math.min(indice, Math.max(total - 1, 0))
  const foto = fotos[actual]
  const varias = total > 1
  const inicioToque = useRef<number | null>(null)

  const ir = (i: number) => setIndice(((i % total) + total) % total)

  const flecha = (direccion: -1 | 1) => (e: MouseEvent) => {
    // En la tarjeta, la foto está dentro de un área clickeable: no abrir el modal.
    e.stopPropagation()
    e.preventDefault()
    ir(actual + direccion)
  }

  const nombreVista = (i: number) => fotos[i]?.vista ?? `Foto ${i + 1}`

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        className="relative overflow-hidden"
        onTouchStart={(e) => {
          if (varias) inicioToque.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const inicio = inicioToque.current
          inicioToque.current = null
          const fin = e.changedTouches[0]?.clientX
          if (inicio === null || fin === undefined) return
          const delta = fin - inicio
          if (Math.abs(delta) > 40) ir(actual + (delta < 0 ? 1 : -1))
        }}
        onKeyDown={(e) => {
          if (!varias) return
          if (e.key === 'ArrowLeft') ir(actual - 1)
          if (e.key === 'ArrowRight') ir(actual + 1)
        }}
      >
        <ProductImage
          src={foto?.src ?? ''}
          alt={varias ? `${p.nombre} — ${nombreVista(actual)}` : p.nombre}
          marca={p.marca}
          categoria={p.categoria}
          width={width}
          eager={eager}
          className={imageClassName}
        />

        {children}

        {varias ? (
          <>
            <BotonFlecha lado="izq" onClick={flecha(-1)} />
            <BotonFlecha lado="der" onClick={flecha(1)} />

            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[4] flex flex-col items-center gap-1.5">
              <span className="rounded-full bg-carbon/75 px-2.5 py-0.5 text-[10px] font-extrabold tracking-[0.2em] text-white uppercase ring-1 ring-white/15 backdrop-blur">
                {nombreVista(actual)} · {actual + 1}/{total}
              </span>
              <div className="flex gap-1.5">
                {fotos.map((f, i) => (
                  <span
                    key={f.src + i}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === actual ? 'w-5 bg-esmeralda' : 'w-1.5 bg-white/50',
                    )}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {varias && miniaturas ? (
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-1 md:px-5"
          role="tablist"
          aria-label="Ángulos de la prenda"
        >
          {fotos.map((f, i) => {
            const activa = i === actual
            return (
              <button
                key={f.src + i}
                type="button"
                role="tab"
                aria-selected={activa}
                aria-label={nombreVista(i)}
                onClick={() => ir(i)}
                className={cn(
                  'group/mini flex shrink-0 flex-col items-center gap-1 rounded-md p-1 transition focus-visible:ring-2 focus-visible:ring-esmeralda focus-visible:outline-none',
                  activa ? 'bg-esmeralda/15' : 'hover:bg-white/5',
                )}
              >
                <span
                  className={cn(
                    'relative block size-16 overflow-hidden rounded bg-grafito-2 ring-2 transition',
                    activa
                      ? 'ring-esmeralda'
                      : 'ring-white/10 group-hover/mini:ring-white/30',
                  )}
                >
                  <img
                    src={imagenCdn(f.src, 160)}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="size-full object-cover"
                  />
                </span>
                <span
                  className={cn(
                    'text-[10px] font-bold tracking-[0.15em] uppercase',
                    activa ? 'text-esmeralda' : 'text-white/55',
                  )}
                >
                  {nombreVista(i)}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function BotonFlecha({
  lado,
  onClick,
}: {
  lado: 'izq' | 'der'
  onClick: (e: MouseEvent) => void
}) {
  const Icono = lado === 'izq' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === 'izq' ? 'Foto anterior' : 'Foto siguiente'}
      className={cn(
        'absolute top-1/2 z-[4] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-carbon/70 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-esmeralda hover:text-carbon focus-visible:ring-2 focus-visible:ring-esmeralda focus-visible:outline-none',
        lado === 'izq' ? 'left-2' : 'right-2',
      )}
    >
      <Icono className="size-5" />
    </button>
  )
}
