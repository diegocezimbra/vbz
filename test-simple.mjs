import { createServer } from 'http'

createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(`<!DOCTYPE html><html><body>
    <h1>✅ Server working!</h1>
    <p>Request: ${req.method} ${req.url}</p>
    <p>Headers: Host=${req.headers.host}</p>
    <p>Time: ${new Date().toISOString()}</p>
  </body></html>`)
}).listen(3000, '0.0.0.0', () => {
  console.log('✅ Test server on port 3000')
})
