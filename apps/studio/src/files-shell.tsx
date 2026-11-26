import * as React from "react"
import {
  ArchiveIcon,
  ClockIcon,
  LayoutTemplateIcon,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@amit-kap/glaze/components/sidebar"

import { BrandMark } from "./brand-mark"
import { FilesSearch, type SearchGroup } from "./files-search"
import { hrefFor, type Route } from "./route"
import { SidebarUser } from "./user-control"

export type Page = "home" | "templates" | "archive"

const pages: { page: Page; label: string; icon: LucideIcon }[] = [
  { page: "home", label: "Recents", icon: ClockIcon },
  { page: "templates", label: "Templates", icon: LayoutTemplateIcon },
  { page: "archive", label: "Archive", icon: ArchiveIcon },
]

const testIds: Record<Page, string> = {
  home: "nav-recents",
  templates: "nav-templates",
  archive: "nav-archive",
}

/** Search and the page links. On a phone the panel is a sheet, so a pick closes it. */
function Nav({
  page,
  archivedCount,
  search,
}: {
  page: Page
  archivedCount: number
  search: SearchGroup[]
}) {
  const { setOpenMobile } = useSidebar()
  const close = () => setOpenMobile(false)
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <FilesSearch groups={search} onPick={close} />
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {pages.map(({ page: target, label, icon: Icon }) => (
              <SidebarMenuItem key={target}>
                <SidebarMenuButton
                  isActive={page === target}
                  data-testid={testIds[target]}
                  onClick={close}
                  render={<a href={hrefFor(target satisfies Route)} />}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
                {target === "archive" && archivedCount > 0 && (
                  <SidebarMenuBadge>{archivedCount}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

/**
 * The files pages' frame: a side panel listing the pages, and the main area
 * beside it. Studio's own chrome, so nothing here wears a theme.
 */
export function FilesShell({
  page,
  archivedCount,
  search,
  children,
}: {
  page: Page
  archivedCount: number
  /** What Search offers: the user's themes, then the templates. */
  search: SearchGroup[]
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      data-testid="studio-home"
      className="h-svh bg-background text-foreground"
    >
      <Sidebar>
        {/* The editor's top bar is this tall, so the mark sits on one line. */}
        <SidebarHeader className="h-15 justify-center px-4">
          <BrandMark />
        </SidebarHeader>

        <SidebarContent>
          <Nav page={page} archivedCount={archivedCount} search={search} />
        </SidebarContent>

        <SidebarFooter>
          <SidebarUser />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  )
}
