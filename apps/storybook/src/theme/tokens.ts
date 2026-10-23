/**
 * Storybook's view of the settings catalog.
 *
 * The catalog itself lives in the library (`@amit-kap/glaze/theme/catalog`) so
 * Studio, Storybook and the CSS export read the same list. This file only
 * turns it into the grouped view the token pages render.
 */
import {
  settings,
  settingGroups,
  settingSections,
  dependentsOf,
  type SettingKind,
} from "@amit-kap/glaze/theme/catalog"
import { settingConsumers } from "@amit-kap/glaze/theme/consumers"

export type TokenKind = SettingKind

export type TokenDoc = {
  token: string
  label: string
  note: string
  kind: TokenKind
  affects?: TokenDoc[]
  fallback?: string
  follows?: string[]
  consumers?: string[]
  setting?: boolean
  fixed?: boolean
}

export type TokenGroup = {
  title: string
  note: string
  items: TokenDoc[]
  collapsed?: boolean
}

export type ThemeSection = {
  id: string
  title: string
  note: string
  groups: TokenGroup[]
}

const labels = new Map<string, string>(
  settings.map((setting) => [setting.token, setting.label])
)

/** Friendly names for the settings a value follows, in catalog order. */
export function followsLabels(tokens: string[]): string[] {
  return tokens.map((token) => labels.get(token) ?? token.replace(/^--/, ""))
}

function toDoc(token: string, withAffects: boolean): TokenDoc | undefined {
  const setting = settings.find((entry) => entry.token === token)
  if (!setting) return undefined
  return {
    token: setting.token,
    label: setting.label,
    note: setting.note,
    kind: setting.kind,
    fallback: setting.fallback,
    follows: setting.follows,
    consumers: settingConsumers[setting.token],
    setting: setting.source === "setting",
    fixed: setting.source === "fixed",
    affects: withAffects
      ? dependentsOf(setting.token).flatMap((entry) => {
          const doc = toDoc(entry.token, false)
          return doc ? [doc] : []
        })
      : undefined,
  }
}

export const themeSections: ThemeSection[] = settingSections.map((section) => ({
  id: section.id,
  title: section.title,
  note: section.note,
  groups: settingGroups
    .filter((group) => group.section === section.id)
    .map((group) => ({
      title: group.title,
      note: group.note,
      collapsed: group.collapsed,
      items: settings
        .filter((setting) => setting.group === group.id)
        .flatMap((setting) => {
          const doc = toDoc(setting.token, true)
          return doc ? [doc] : []
        }),
    })),
}))
