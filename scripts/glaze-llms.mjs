// Writes llms.txt and one markdown file per component for agents reading the
// Storybook build: what each component is for (the story's docs description),
// how to import it, its exports, cva variants and data-slot parts.
// Usage: node scripts/glaze-llms.mjs [outDir]   (default apps/storybook/.llms)

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const root = new URL("..", import.meta.url).pathname
const componentsDir = join(root, "packages/ui/src/components")
const storiesDir = join(root, "apps/storybook/src/stories")
const outDir = process.argv[2] ?? join(root, "apps/storybook/.llms")
const pkg = JSON.parse(readFileSync(join(root, "packages/ui/package.json"), "utf8")).name

const parse = (file) =>
  ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true)

function walk(node, visit) {
  visit(node)
  ts.forEachChild(node, (child) => walk(child, visit))
}

const propName = (p) => p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : undefined
const prop = (obj, name) =>
  obj && ts.isObjectLiteralExpression(obj)
    ? obj.properties.find((p) => ts.isPropertyAssignment(p) && propName(p) === name)?.initializer
    : undefined

function text(expr) {
  if (!expr) return undefined
  if (ts.isStringLiteralLike(expr)) return expr.text
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return (text(expr.left) ?? "") + (text(expr.right) ?? "")
  }
}

function readComponent(file) {
  const sf = parse(file)
  const exports = []
  const variants = {}
  const slots = new Set()
  walk(sf, (n) => {
    if (ts.isExportDeclaration(n) && n.exportClause && ts.isNamedExports(n.exportClause)) {
      exports.push(...n.exportClause.elements.map((e) => e.name.text))
    }
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "cva") {
      const name = ts.isVariableDeclaration(n.parent) ? n.parent.name.getText() : "cva"
      const groups = prop(n.arguments[1], "variants")
      const defaults = prop(n.arguments[1], "defaultVariants")
      if (groups && ts.isObjectLiteralExpression(groups)) {
        variants[name] = groups.properties.filter(ts.isPropertyAssignment).map((g) => ({
          name: propName(g),
          options: ts.isObjectLiteralExpression(g.initializer)
            ? g.initializer.properties.map(propName).filter(Boolean)
            : [],
          default: text(prop(defaults, propName(g))),
        }))
      }
    }
    if (ts.isJsxAttribute(n) && n.name.getText() === "data-slot" && n.initializer) {
      const v = text(n.initializer)
      if (v) slots.add(v)
    }
  })
  return { exports, variants, slots: [...slots] }
}

function readStory(file) {
  const sf = parse(file)
  let title, description, upstream
  const stories = []
  walk(sf, (n) => {
    if (ts.isVariableDeclaration(n) && n.name.getText() === "meta") {
      const obj = ts.isSatisfiesExpression(n.initializer) || ts.isAsExpression(n.initializer)
        ? n.initializer.expression
        : n.initializer
      title = text(prop(obj, "title"))
      description = text(prop(prop(prop(prop(obj, "parameters"), "docs"), "description"), "component"))
    }
    if (ts.isVariableStatement(n) && n.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      stories.push(...n.declarationList.declarations.map((d) => d.name.getText()))
    }
  })
  upstream = sf.text.match(/https:\/\/ui\.shadcn\.com\/docs\/components\/[\w/-]+/)?.[0]
  return { title, description, upstream, stories }
}

const storyId = (title, name = "docs") =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}--${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`

const storyFiles = new Set(readdirSync(storiesDir))
const entries = readdirSync(componentsDir)
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((f) => {
    const slug = f.replace(/\.tsx$/, "")
    const story = storyFiles.has(`${slug}.stories.tsx`) ? readStory(join(storiesDir, `${slug}.stories.tsx`)) : {}
    return { slug, ...readComponent(join(componentsDir, f)), ...story }
  })

rmSync(outDir, { recursive: true, force: true })
mkdirSync(join(outDir, "llms"), { recursive: true })

for (const c of entries) {
  const name = c.title?.split("/").pop() ?? c.slug
  const lines = [`# ${name}`, ""]
  if (c.description) lines.push(c.description, "")
  lines.push("```tsx", `import { ${c.exports.join(", ")} } from "${pkg}/components/${c.slug}"`, "```", "")
  for (const [fn, groups] of Object.entries(c.variants)) {
    lines.push(`## Variants (\`${fn}\`)`, "")
    for (const g of groups) {
      lines.push(`- \`${g.name}\`: ${g.options.map((o) => `\`${o}\``).join(", ")}${g.default ? ` (default \`${g.default}\`)` : ""}`)
    }
    lines.push("")
  }
  if (c.slots.length) {
    lines.push("## Parts", "", "Style or select parts by `data-slot`: " + c.slots.map((s) => `\`${s}\``).join(", ") + ".", "")
  }
  if (c.title) {
    lines.push("## Examples", "")
    lines.push(...c.stories.map((s) => `- [${s}](../?path=/story/${storyId(c.title, s)})`), "")
  }
  if (c.upstream) lines.push(`Upstream reference: ${c.upstream}`, "")
  writeFileSync(join(outDir, "llms", `${c.slug}.md`), lines.join("\n"))
}

const index = [
  `# Glaze (${pkg})`,
  "",
  "> A themeable React component library: shadcn/ui components on Base UI, styled with Tailwind CSS v4 through a token contract (themes set inputs; components use system utilities such as text-body, rounded-control, shadow-floating).",
  "",
  `Install \`${pkg}\`, import \`${pkg}/globals.css\` and a theme from \`${pkg}/themes/<name>.css\`, then set \`data-theme\` on the root.`,
  "",
  "## Components",
  "",
  ...entries.map((c) => {
    const name = c.title?.split("/").pop() ?? c.slug
    const summary = c.description?.split(/(?<=\.)\s/)[0]
    return `- [${name}](llms/${c.slug}.md)${summary ? `: ${summary}` : ""}`
  }),
  "",
]
writeFileSync(join(outDir, "llms.txt"), index.join("\n"))
console.log(`Wrote llms.txt and ${entries.length} component files to ${outDir}`)
