import { createServer } from 'http'
import serverModule from './dist/server/server.js'

const server = serverModule

const port = process.env.PORT || 3000

const httpServer = createServer(async (req, res) => {
  try {
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

    res.writeHead(response.status, headers)
    res.end(await response.text())
  } catch (error) {
    console.error('Server error:', error.message, error.stack)
    res.writeHead(500, { 'content-type': 'text/plain' })
    res.end('Internal Server Error: ' + error.message)
  }
})

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`)
})
