/* eslint-disable no-restricted-globals */
export default function LiveReload({ port = Number(8002) }: { port?: number }) {
  let setupLiveReload = ((port: number) => {
    let protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    let [host, ...rest] = location.hostname.split('.')
    let socketPath = `${protocol}//${host}-${port}.${rest.join('.')}/socket`
    console.log(`connecting to socket ${socketPath}`)
    let ws = new WebSocket(socketPath)
    ws.onmessage = (message) => {
      let event = JSON.parse(message.data)
      if (event.type === 'LOG') {
        console.log(event.message)
      }
      if (event.type === 'RELOAD') {
        console.log('💿 Reloading window ...')
        window.location.reload()
      }
    }
    ws.onerror = (error) => {
      console.log('Remix dev asset server web socket error:')
      console.error(error)
    }
  }).toString()

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${setupLiveReload})(${JSON.stringify(port)})`,
      }}
    />
  )
}
