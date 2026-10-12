// The theme's type scale in use: a short article, headings in the heading
// typeface and running text in the body one.
export function TypographyDemo() {
  return (
    <article className="flex max-w-prose flex-col gap-3 text-body">
      <p className="text-caption text-muted-foreground">
        Field notes · 6 min read
      </p>
      <h2 className="font-heading text-display font-strong text-balance">
        Designing for the quiet hours
      </h2>
      <p className="text-pretty text-muted-foreground">
        Most of a team's work happens between meetings, in the long stretches
        where nobody is watching the dashboard. A good tool stays out of the way
        then and speaks up only when something needs a decision.
      </p>
      <h3 className="mt-4 font-heading text-heading font-strong">
        Start with the defaults
      </h3>
      <p className="text-pretty">
        People rarely change settings, so the defaults are the product. Pick the
        calmest option that still works for a busy Monday, and make the louder
        ones easy to find when they're needed.
      </p>
      <h4 className="mt-2 font-heading text-title font-medium">
        Let the content lead
      </h4>
      <p className="text-pretty">
        Chrome should frame the work, not compete with it. Keep borders light,
        reserve colour for state, and let a clear type scale do the organising.
      </p>
      <p className="mt-2 text-caption text-muted-foreground">
        Written by the design team. Last updated October 11.
      </p>
    </article>
  )
}
