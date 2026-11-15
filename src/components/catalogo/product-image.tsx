import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { etiquetaCategoria, imagenCdn } from '@/lib/catalogo'

interface Props {
  src: string
  alt: string
  marca: string
  categoria: string
  /** Ancho pedido al Image CDN. */
  width?: number
  className?: string
  eager?: boolean
}

/**
 * Foto vertical 4:5. Si el producto no tiene foto (imagen: '') o la foto
 * no carga, muestra un placeholder tipográfico con la marca.
 */
export function ProductImage({
  src,
  alt,
  marca,
  categoria,
  width = 640,
  className,
  eager,
}: Props) {
  const [srcFallido, setSrcFallido] = useState<string | null>(null)
  // Fotos horizontales (más anchas que altas): se muestran completas sobre un
  // fondo difuminado de la misma foto, en vez de recortarlas al formato 4:5.
  const [srcHorizontal, setSrcHorizontal] = useState<string | null>(null)
  const conFoto = Boolean(src) && srcFallido !== src
  const horizontal = srcHorizontal === src
  const url = imagenCdn(src, width)
  const imgRef = useRef<HTMLImageElement>(null)

  // Si la foto ya cargó antes de que React hidrate, onLoad no se dispara:
  // revisamos sus medidas al montar.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > img.naturalHeight) {
      setSrcHorizontal(src)
    }
  }, [src])

  return (
    <div
      className={cn(
        'relative aspect-[4/5] w-full overflow-hidden bg-grafito-2',
        className,
      )}
    >
      {conFoto ? (
        <>
          {horizontal ? (
            <img
              src={url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full scale-125 object-cover opacity-40 blur-2xl"
            />
          ) : null}
          <img
            ref={imgRef}
            src={url}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            draggable={false}
            onError={() => setSrcFallido(src)}
            onLoad={(e) => {
              const img = e.currentTarget
              if (img.naturalWidth > img.naturalHeight) setSrcHorizontal(src)
            }}
            className={cn(
              'absolute inset-0 size-full',
              horizontal ? 'object-contain' : 'object-cover',
            )}
          />
        </>
      ) : (
        <Placeholder marca={marca} categoria={categoria} />
      )}
    </div>
  )
}

function Placeholder({
  marca,
  categoria,
}: {
  marca: string
  categoria: string
}) {
  const palabra = marca.toUpperCase()
  return (
    <div
      aria-hidden="true"
      className="tp-grain absolute inset-0 flex flex-col justify-between bg-[radial-gradient(120%_80%_at_20%_0%,#1f3b2a_0%,#161a18_55%,#0d0f0e_100%)] p-4"
    >
      {/* Marca repetida estilo lookbook */}
      <div className="pointer-events-none absolute inset-0 flex -rotate-12 scale-125 flex-col justify-center gap-1 opacity-[0.14]">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'font-display text-6xl leading-none whitespace-nowrap text-esmeralda',
              i % 2 ? 'tp-outline-text translate-x-8' : '',
            )}
          >
            {palabra} {palabra} {palabra}
          </span>
        ))}
      </div>
      <span className="relative z-[2] self-end font-marker text-xs text-esmeralda/70">
        foto pronto
      </span>
      <div className="relative z-[2]">
        <p className="font-display text-3xl leading-[0.9] tracking-wide text-white/90 uppercase sm:text-4xl">
          {palabra}
        </p>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.25em] text-white/50 uppercase">
          {etiquetaCategoria(categoria)}
        </p>
      </div>
    </div>
  )
}
