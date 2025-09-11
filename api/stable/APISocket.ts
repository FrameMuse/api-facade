import { Socket } from "socket.io-client"

import LocalStorageKey from "@/services/LocalStorage/LocalStorageKey"
import observableLocalStorage from "@/utils/transform/observableLocalStorage"

import SocketManager from "../SocketManager"


interface StreamAPISocketListenEvents {
  CONNECTED_OCB_APPS(data: { companyId: string, connected: string[] }): void
  CONNECTED_MENU_APPS(data: { companyId: string, connected: string[] }): void
}
interface StreamAPISocketEmitEvents {
  CONNECTED_OCBS(data: { companyId: string }): Promise<{ appId: string }[]>
  INITIATE_CONNECTION(token: string): void
}

class StreamAPISocket implements Disposable {
  readonly socket: Socket<StreamAPISocketListenEvents, StreamAPISocketEmitEvents>
  private readonly unsubscribes = new Set<() => void>()

  private get authToken() {
    const token = observableLocalStorage.getItem(LocalStorageKey.UserToken)
    if (token == null) {
      throw new TypeError("StreamAPISocket: UserToken must be a string")
    }
    return token
  }

  constructor(namespace: string, _options?: never) {
    const url = new URL(namespace, import.meta.env.VITE_API_HOST)

    this.socket = SocketManager.get(url.toString(), _options)
    this.socket.connect()
    this.socket.emit("INITIATE_CONNECTION", this.authToken) // Auth.
  }

  public on<EventName extends keyof StreamAPISocketListenEvents>(name: EventName, listener: StreamAPISocketListenEvents[EventName]) {
    switch (name) {
      case "CONNECTED_OCB_APPS":
      case "CONNECTED_MENU_APPS":
        this.socket.on(name, listener as never)
        break

      default:
        throw new Error(`StreamAPISocket: the event ${name} is not allowed.`)
    }

    const unsubscribe = () => void this.socket.off(name, listener as never)
    this.unsubscribes.add(unsubscribe)
    return unsubscribe
  }

  [Symbol.dispose]() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe())

    // Don't disconnect if there are other instances using the same socket.
    if (this.socket.listenersAny().length > 0) return
    this.socket.disconnect()
  }
}

export default StreamAPISocket
