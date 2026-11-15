import { cn } from '@/lib/utils'
import { etiquetaCategoria, formatoPrecio, type Producto } from '@/lib/catalogo'
import { ProductGallery } from './product-gallery'

export function EstadoBadge({
  estado,
  className,
}: {
  estado: Producto['estado']
  className?: string
}) {
  const disponible = estado === 'Disponible'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase backdrop-blur',
        disponible
          ? 'bg-carbon/75 text-esmeralda ring-1 ring-esmeralda/40'
          : 'bg-carbon/80 text-white/60 ring-1 ring-white/15',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          disponible ? 'bg-esmeralda' : 'bg-white/40',
        )}
      />
      {estado}
    </span>
  )
}

export function MarcaBadge({ marca }: { marca: string }) {
  return (
    <span className="inline-block -rotate-2 bg-white px-2 py-0.5 font-display text-sm tracking-widest text-carbon uppercase shadow">
      {marca}
    </span>
  )
}

interface Props {
  producto: Producto
  onAbrir?: (p: Producto) => void
  eager?: boolean
}

export function ProductCard({ producto: p, onAbrir, eager }: Props) {
  const agotado = p.estado === 'Agotado'
  return (
    <div
      onClick={() => onAbrir?.(p)}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-grafito text-left ring-1 ring-white/5 transition duration-300 hover:-translate-y-1 hover:ring-esmeralda/50 has-[.tp-abrir:focus-visible]:ring-2 has-[.tp-abrir:focus-visible]:ring-esmeralda"
    >
      <ProductGallery
        producto={p}
        eager={eager}
        imageClassName={cn(
          'transition duration-500 group-hover:scale-[1.03]',
          agotado && 'grayscale-[0.7]',
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex items-start justify-between p-3">
          <MarcaBadge marca={p.marca} />
          <EstadoBadge estado={p.estado} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16 bg-gradient-to-t from-grafito to-transparent" />
      </ProductGallery>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-2">
        <p className="text-[10px] font-bold tracking-[0.2em] text-esmeralda/80 uppercase">
          {etiquetaCategoria(p.categoria)}
        </p>
        <h3 className="font-display text-xl leading-tight tracking-wide text-white uppercase sm:text-2xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAbrir?.(p)
            }}
            className="tp-abrir text-left uppercase focus-visible:outline-none"
          >
            {p.nombre}
          </button>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
          {p.descripcion}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex flex-wrap gap-1">
            {p.tallas.map((t) => (
              <span
                key={t}
                className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
          <span
            className={cn(
              'shrink-0 text-lg font-extrabold tabular-nums',
              agotado ? 'text-white/50 line-through' : 'text-white',
            )}
          >
            {formatoPrecio(p.precio)}
          </span>
        </div>
      </div>
    </div>
  )
}
