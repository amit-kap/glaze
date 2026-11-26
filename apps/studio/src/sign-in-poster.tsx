import { Logo } from "./logo"
import { Sprinkles } from "./brand-mark"
import { SignInButton } from "./user-control"

// [x%, y%, rotation] over the poster's far side, around the mark.
const sprinkles: [number, number, number][] = [
  [52, 16, 32],
  [61, 62, -48],
  [70, 22, 74],
  [58, 84, 18],
  [93, 10, -24],
  [96, 58, 58],
  [79, 6, -62],
  [47, 46, 40],
]

/**
 * The signed-out prompt, as a brand poster: frosting, ink, the mark. It says
 * what signing in gives: the themes this browser already holds, if any, or a
 * place for the ones to come.
 */
export function SignInPoster({ saved }: { saved: number }) {
  return (
    <section
      data-theme="glaze"
      data-testid="sign-in-poster"
      // Narrow, the words sit at the top and the mark in the corner below them.
      className="poster relative isolate flex min-h-72 items-start overflow-hidden rounded-container bg-background p-8 text-foreground @xl:min-h-64 @xl:items-center @4xl:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Sprinkles points={sprinkles} className="hidden @xl:block" />
        <Logo className="donut absolute -inset-e-6 -bottom-12 size-44 @xl:inset-e-12 @xl:-bottom-20 @xl:size-72 @4xl:inset-e-32" />
      </div>
      <div className="relative flex max-w-md flex-col items-start gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-brand text-poster text-balance">
            {saved > 0
              ? `You have ${saved} saved ${saved === 1 ? "theme" : "themes"} waiting.`
              : "Keep every theme you make."}
          </h2>
          <p className="max-w-xs text-title text-muted-foreground">
            {saved > 0
              ? "Sign in to open them from here."
              : "Sign in and your saved themes live here, one click from the editor."}
          </p>
        </div>
        <SignInButton variant="default" size="lg" />
      </div>
    </section>
  )
}
