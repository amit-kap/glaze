import { age, type SavedTheme } from "./library"
import { BrandMark } from "./brand-mark"
import { NewThemeCard, ThemeCard } from "./theme-card"
import { templates, type Template } from "./templates"
import { SignInButton, UserControl } from "./user-control"
import { useUser } from "./user"

const grid = "grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"

/** Home: the template themes, and the signed-in user's own. */
export function Home({
  themes,
  onOpenTemplate,
  onOpenTheme,
  onCreate,
  onDelete,
}: {
  themes: SavedTheme[]
  onOpenTemplate: (template: Template) => void
  onOpenTheme: (theme: SavedTheme) => void
  onCreate: () => void
  onDelete: (id: string) => void
}) {
  const { user } = useUser()
  return (
    <div
      data-testid="studio-home"
      className="flex min-h-full flex-col bg-background text-foreground"
    >
      <header className="flex h-15 shrink-0 items-center justify-between px-8">
        <BrandMark />
        <UserControl />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-8 pt-6 pb-16">
        <section
          aria-labelledby="home-templates"
          className="flex flex-col gap-5"
        >
          <h2 id="home-templates" className="text-title font-medium">
            Templates
          </h2>
          <div className={grid}>
            {templates.map((template) => (
              <ThemeCard
                key={template.name}
                name={template.name}
                stored={template.data}
                testId="template-card"
                template={template.name}
                onOpen={() => onOpenTemplate(template)}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="home-yours" className="flex flex-col gap-5">
          <h2 id="home-yours" className="text-title font-medium">
            Your themes
          </h2>
          {user ? (
            <>
              <div className={grid}>
                <NewThemeCard onClick={onCreate} />
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    name={theme.name}
                    stored={theme.data}
                    meta={`saved ${age(theme.savedAt)}`}
                    testId="theme-card"
                    onOpen={() => onOpenTheme(theme)}
                    onDelete={() => onDelete(theme.id)}
                  />
                ))}
              </div>
              {themes.length === 0 && (
                <p className="text-body text-muted-foreground">
                  Themes you save appear here.
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-container border border-dashed px-5 py-4">
              <p className="text-body text-muted-foreground">
                Sign in to see your themes.
              </p>
              <SignInButton />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
