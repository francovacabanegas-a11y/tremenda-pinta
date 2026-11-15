import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { INSTAGRAM_USUARIO } from '@/data/config.js'
import { LOGO_SRC, enlaceWhatsApp, imagenCdn } from '@/lib/catalogo'
import { WhatsAppIcon } from './whatsapp-icon'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-carbon">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={imagenCdn(LOGO_SRC, 160)}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className="size-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-display text-2xl tracking-wide text-white">
              TREMENDA PINTA
            </p>
            <p className="font-marker text-sm text-esmeralda">
              Q&apos; pintanga el camba
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={enlaceWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-bosque px-5 text-sm font-bold text-white ring-1 ring-esmeralda/30 transition hover:bg-esmeralda hover:text-carbon"
          >
            <WhatsAppIcon /> Pedidos por WhatsApp
          </a>
          {INSTAGRAM_USUARIO ? (
            <a
              href={`https://instagram.com/${INSTAGRAM_USUARIO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full px-5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:ring-esmeralda"
            >
              @{INSTAGRAM_USUARIO}
            </a>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-white/35 sm:px-6">
          <p>
            © {new Date().getFullYear()} TREMENDA PINTA · Ropa americana
            original
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-white/30 transition hover:bg-white/5 hover:text-white/70"
          >
            <Lock className="size-3" /> Modo Admin / Nuevo Producto
          </Link>
        </div>
      </div>
    </footer>
  )
}
