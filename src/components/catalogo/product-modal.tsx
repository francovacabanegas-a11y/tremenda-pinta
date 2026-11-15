import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  enlaceWhatsApp,
  etiquetaCategoria,
  formatoPrecio,
  mensajePedido,
  type Producto,
} from '@/lib/catalogo'
import { ProductGallery } from './product-gallery'
import { EstadoBadge, MarcaBadge } from './product-card'
import { WhatsAppIcon } from './whatsapp-icon'

interface Props {
  producto: Producto | null
  onCerrar: () => void
}

export function ProductModal({ producto, onCerrar }: Props) {
  const [talla, setTalla] = useState<string | undefined>()

  // Al abrir otra prenda: si tiene una sola talla, la preseleccionamos.
  useEffect(() => {
    setTalla(producto?.tallas.length === 1 ? producto.tallas[0] : undefined)
  }, [producto])

  return (
    <DialogPrimitive.Root
      open={producto !== null}
      onOpenChange={(abierto) => !abierto && onCerrar()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[94dvh] overflow-y-auto rounded-t-2xl bg-grafito text-white shadow-2xl ring-1 ring-white/10 duration-300 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom md:inset-auto md:top-1/2 md:left-1/2 md:w-[min(64rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-hidden md:rounded-xl md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=closed]:zoom-out-95 md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=open]:zoom-in-95">
          {producto ? (
            <ContenidoModal
              producto={producto}
              talla={talla}
              onTalla={setTalla}
            />
          ) : null}
          <DialogPrimitive.Close
            className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-carbon/80 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-esmeralda hover:text-carbon"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function ContenidoModal({
  producto: p,
  talla,
  onTalla,
}: {
  producto: Producto
  talla?: string
  onTalla: (t: string) => void
}) {
  const agotado = p.estado === 'Agotado'

  return (
    <div className="grid md:max-h-[88dvh] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Foto grande */}
      <div className="relative mx-auto w-full max-w-md md:max-w-none md:overflow-y-auto md:pb-4">
        <ProductGallery
          key={p.id}
          producto={p}
          width={1080}
          eager
          miniaturas
          imageClassName={cn(agotado && 'grayscale-[0.6]')}
        >
          <div className="pointer-events-none absolute top-4 left-4 z-[3]">
            <MarcaBadge marca={p.marca} />
          </div>
        </ProductGallery>
      </div>

      {/* Texto tipo revista */}
      <div className="flex flex-col p-5 sm:p-8 md:overflow-y-auto">
        <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
          <span>{etiquetaCategoria(p.categoria)}</span>
          <span className="h-px flex-1 bg-white/15" />
          <EstadoBadge estado={p.estado} />
        </div>

        <DialogPrimitive.Title className="mt-4 font-display text-4xl leading-[0.95] tracking-wide uppercase sm:text-5xl">
          {p.nombre}
        </DialogPrimitive.Title>

        <p
          className={cn(
            'mt-3 text-3xl font-extrabold tabular-nums',
            agotado ? 'text-white/50' : 'text-esmeralda',
          )}
        >
          {formatoPrecio(p.precio)}
        </p>

        <DialogPrimitive.Description className="mt-5 border-l-2 border-esmeralda pl-4 text-[15px] leading-relaxed text-white/75">
          {p.descripcion}
        </DialogPrimitive.Description>

        <div className="mt-6">
          <p className="mb-2.5 text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
            Tallas disponibles{' '}
            {p.tallas.length > 1 ? (
              <span className="font-medium tracking-normal normal-case text-white/40">
                · tocá una para incluirla en el pedido
              </span>
            ) : null}
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Talla"
          >
            {p.tallas.map((t) => {
              const activa = talla === t
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={activa}
                  onClick={() => onTalla(t)}
                  className={cn(
                    'h-11 min-w-12 rounded-md border px-3 text-sm font-bold transition',
                    activa
                      ? 'border-esmeralda bg-esmeralda text-carbon'
                      : 'border-white/20 text-white hover:border-esmeralda/70',
                  )}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 md:mt-auto md:pt-8">
          <a
            href={enlaceWhatsApp(mensajePedido(p, talla))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex h-14 w-full items-center justify-center gap-2.5 rounded-full text-base font-extrabold tracking-wide uppercase transition',
              agotado
                ? 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15'
                : 'bg-esmeralda text-carbon shadow-[0_10px_40px_-12px_rgba(34,197,94,0.8)] hover:bg-[#2fe06d]',
            )}
          >
            <WhatsAppIcon className="size-6" />
            {agotado ? 'Avisame cuando vuelva' : 'Pedir por WhatsApp'}
          </a>
          <p className="mt-3 text-center text-xs text-white/45">
            Se abre WhatsApp con el nombre, marca, talla
            {talla ? '' : ' (elegí una arriba)'} y precio de la prenda ya
            escritos.
          </p>
        </div>
      </div>
    </div>
  )
}
