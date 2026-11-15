import { ArrowDown } from 'lucide-react'
import { FRASE_PORTADA } from '@/data/config.js'
import { LOGO_SRC, PRODUCTOS, imagenCdn } from '@/lib/catalogo'

const CINTA = [
  'ROPA AMERICANA ORIGINAL',
  'DICKIES',
  'WORKWEAR',
  'STREETWEAR',
  'HIP-HOP',
  'PEDIDOS POR WHATSAPP',
]

export function Hero() {
  const disponibles = PRODUCTOS.filter((p) => p.estado === 'Disponible').length

  return (
    <section className="tp-grain relative overflow-hidden border-b border-white/5">
      {/* Fondo: brillo verde + tipografía gigante */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_20%,rgba(34,197,94,0.22),transparent_70%),radial-gradient(50%_60%_at_0%_100%,rgba(20,83,45,0.55),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="tp-outline-text pointer-events-none absolute -right-6 bottom-6 font-display text-[9rem] leading-none text-white/[0.06] select-none sm:text-[14rem] lg:text-[18rem]"
      >
        PINTA
      </span>

      <div className="relative z-[2] mx-auto grid max-w-content items-center gap-10 px-4 pt-8 pb-14 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-14 md:pb-20 lg:gap-16">
        <div className="order-2 md:order-1">
          {/* Cabecera tipo revista */}
          <div className="mb-6 flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
            <span className="rounded-sm bg-esmeralda px-2 py-0.5 text-carbon">
              Vol. 01
            </span>
            <span>Lookbook</span>
            <span className="h-px flex-1 bg-white/15" />
            <span>{new Date().getFullYear()}</span>
          </div>

          <h1 className="font-display text-[3.6rem] leading-[0.86] tracking-tight text-white uppercase sm:text-7xl lg:text-[6.5rem]">
            Q&apos; Pintanga
            <br />
            <span className="text-esmeralda">el camba</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            {FRASE_PORTADA}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#catalogo"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-esmeralda px-7 text-sm font-extrabold tracking-wider text-carbon uppercase shadow-[0_10px_40px_-10px_rgba(34,197,94,0.7)] transition hover:bg-[#2fe06d]"
            >
              Ver Catálogo
              <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
            </a>
            <span className="text-sm text-muted-foreground">
              <strong className="font-bold text-white">{disponibles}</strong>{' '}
              prendas disponibles hoy
            </span>
          </div>
        </div>

        {/* Logo tipo sticker / portada */}
        <div className="relative order-1 mx-auto w-full max-w-[280px] sm:max-w-sm md:order-2 md:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-6 rounded-xl border-2 border-dashed border-esmeralda/30"
          />
          <div className="relative -rotate-3 overflow-hidden rounded-xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition duration-500 hover:rotate-0">
            <img
              src={imagenCdn(LOGO_SRC, 720)}
              alt="TREMENDA PINTA — Q' PINTANGA EL CAMBA"
              width={640}
              height={640}
              fetchPriority="high"
              className="aspect-square w-full object-cover"
            />
          </div>
          {/* Cinta adhesiva */}
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-esmeralda/80 shadow-md"
          />
          <span className="absolute -right-2 -bottom-4 rotate-6 rounded-sm bg-bosque px-3 py-1.5 font-marker text-sm text-white shadow-lg sm:text-base">
            100% original 🇺🇸
          </span>
        </div>
      </div>

      {/* Cinta corrida */}
      <div className="relative z-[2] overflow-hidden border-t border-white/10 bg-bosque py-2.5">
        <div className="tp-marquee flex w-max gap-8 font-display text-lg tracking-wider whitespace-nowrap text-white/90 uppercase">
          {[...CINTA, ...CINTA, ...CINTA, ...CINTA].map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              {t}
              <span className="text-esmeralda">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
