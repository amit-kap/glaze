// Minimal CDP driver for review screenshots: open URL, wait, run JS, capture.
// Temporary; not part of the project.
import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"
import WebSocket from "ws"

const [url, out, script = "", w = "1600", h = "1000"] = process.argv.slice(2)
setTimeout(() => { console.error("timed out"); process.exit(2) }, 30000)
const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${w},${h}`,
   "--remote-debugging-port=9333", "--user-data-dir=/tmp/cdp-profile", "about:blank"],
  { stdio: "ignore" }
)
const done = (code) => { try { chrome.kill("SIGKILL") } catch {} process.exit(code) }
try {
  let list = []
  for (let i = 0; i < 20 && !list.some((t) => t.type === "page"); i++) {
    await new Promise((r) => setTimeout(r, 300))
    try { list = await (await fetch("http://127.0.0.1:9333/json")).json() } catch {}
  }
  const page = list.find((t) => t.type === "page")
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  let id = 0; const pending = {}
  ws.on("message", (m) => { const d = JSON.parse(m); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id] } })
  const send = (method, params = {}) => new Promise((r) => { id++; pending[id] = r; ws.send(JSON.stringify({ id, method, params })) })
  await new Promise((r) => ws.on("open", r))
  await send("Page.enable"); await send("Runtime.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: false })
  await send("Page.navigate", { url })
  await new Promise((r) => setTimeout(r, 4000))
  if (script) {
    const r = await send("Runtime.evaluate", { expression: script, awaitPromise: true })
    if (r.error || r.result?.exceptionDetails) console.error(JSON.stringify(r.error ?? r.result.exceptionDetails))
    await new Promise((r) => setTimeout(r, 1500))
  }
  const shot = await send("Page.captureScreenshot", { format: "png" })
  if (!shot.result?.data) { console.error(JSON.stringify(shot)); done(1) }
  writeFileSync(out, Buffer.from(shot.result.data, "base64"))
  ws.close(); done(0)
} catch (e) { console.error(e); done(1) }
