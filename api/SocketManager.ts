import { io, Socket } from "socket.io-client"

/**
 * Ensures only one running socket connection per URL.
 */
class SocketManager {
  private readonly sockets = new Map<string, Socket>()

  get(url: string, _options?: never) {
    const socketCached = this.sockets.get(url)
    if (socketCached != null) return socketCached

    const socket = io(url, _options)
    this.sockets.set(url, socket)
    return socket
  }
}

export default new SocketManager
