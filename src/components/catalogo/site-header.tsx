import { Link } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { LOGO_SRC, enlaceWhatsApp, imagenCdn } from '@/lib/catalogo'
import { WhatsAppIcon } from './whatsapp-icon'

interface Props {
  busqueda?: string
  onBusqueda?: (valor: string) => void
}

export function SiteHeader({ busqueda, onBusqueda }: Props) {
  const conBuscador = typeof onBusqueda === 'function'

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-carbon/85 backdrop-blur-xl supports-[backdrop-filter]:bg-carbon/70">
      <div className="mx-auto flex max-w-content items-center gap-3 px-4 py-2.5 sm:gap-5 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="TREMENDA PINTA — inicio"
        >
          <img
            src={imagenCdn(LOGO_SRC, 112)}
            alt="Logo TREMENDA PINTA"
            width={44}
            height={44}
            className="size-11 rounded-md object-cover ring-1 ring-esmeralda/40"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-xl tracking-wide text-white">
              TREMENDA PINTA
            </span>
            <span className="mt-1 font-marker text-[11px] text-esmeralda">
              Q&apos; pintanga el camba
            </span>
          </span>
        </Link>

        {conBuscador ? (
          <label className="relative ml-auto flex min-w-0 flex-1 items-center sm:max-w-md">
            <span className="sr-only">Buscar por nombre o marca</span>
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => onBusqueda?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document
                    .getElementById('catalogo')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              placeholder="Buscar prenda o marca…"
              className="h-10 w-full rounded-full border border-border bg-grafito pr-9 pl-9 text-sm text-white placeholder:text-muted-foreground focus:border-esmeralda focus:ring-2 focus:ring-esmeralda/30 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {busqueda ? (
              <button
                type="button"
                onClick={() => onBusqueda?.('')}
                className="absolute right-2 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </label>
        ) : (
          <div className="ml-auto" />
        )}

        <a
          href={enlaceWhatsApp(
            '¡Hola TREMENDA PINTA! 👋 Vi el catálogo y quiero hacer una consulta.',
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-esmeralda px-3 text-sm font-bold text-carbon transition hover:bg-[#2fe06d] sm:px-4"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sr-only sm:hidden">Escribinos por WhatsApp</span>
        </a>
      </div>
    </header>
  )
}
