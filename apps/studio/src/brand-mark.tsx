import { Badge } from "@amit-kap/glaze/components/badge"

import { Logo, logoPink } from "./logo"

/** The logo, the Alpha badge and the Glaze version, as both top bars show them. */
export function BrandMark({ homeHref }: { homeHref?: string }) {
  const logo = <Logo />
  return (
    <div className="flex items-center gap-2">
      {homeHref ? (
        <a
          href={homeHref}
          data-testid="home-link"
          aria-label="Glaze Studio home"
          className="rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {logo}
        </a>
      ) : (
        logo
      )}
      <Badge
        variant="outline"
        className="h-auto px-1.5 py-0.5 text-[10px] leading-none uppercase"
        style={{ color: logoPink, borderColor: logoPink }}
      >
        Alpha
      </Badge>
      {__GLAZE_VERSION__ && (
        <span className="text-caption text-muted-foreground tabular-nums">
          {__GLAZE_VERSION__}
        </span>
      )}
    </div>
  )
}
