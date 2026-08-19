import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import serverModule from './dist/server/server.js'
import { contentTypeOf, safeStaticPath } from './server-static.mjs'

const server = serverModule
const port = process.env.PORT || 3000
const CLIENT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'dist', 'client')

/**
 * Estáticos ANTES do SSR. Sem isso todo /assets/*.css e *.js cai no handler de
 * página e volta 404 — a página monta sem estilo nenhum, que foi exatamente o que
 * aconteceu no primeiro deploy.
 *
 * Nome de arquivo da build é hasheado, então cache longo e imutável é seguro: mudou
 * o conteúdo, mudou o nome.
 */
async function tryStatic(req, res) {
  const path = safeStaticPath(req.url ?? '/', CLIENT_DIR)
  if (!path) return false

  let info
  try {
    info = await stat(path)
  } catch {
    return false
  }
  if (!info.isFile()) return false

  res.writeHead(200, {
    'content-type': contentTypeOf(path),
    'content-length': info.size,
    'cache-control': req.url.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600',
  })
  createReadStream(path).pipe(res)
  return true
}

const httpServer = createServer(async (req, res) => {
  try {
    if (await tryStatic(req, res)) return

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    })

    const response = await server.fetch(request)
    const headers = Object.fromEntries(response.headers)
    headers['cache-control'] = 'public, max-age=0, must-revalidate'
    headers['cf-cache-tag'] = 'vbz-landing'

    // arrayBuffer em vez de text(): o SSR também devolve resposta binária (imagem de
    // rota, favicon), e .text() corrompe byte não-UTF8 silenciosamente.
    const body = Buffer.from(await response.arrayBuffer())
    headers['content-length'] = body.byteLength
    res.writeHead(response.status, headers)
    res.end(body)
  } catch (error) {
    console.error('Server error:', error.message, error.stack)
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error: ' + error.message)
  }
})

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`)
})
