class APIFacade {
    fetch
    
    events = new APIFacadeEvents
    socket = IO // Default: IO

    // Alt: combines events and socket
    messages


    /**
     * Bubbling for tabs.
     * 
     * Optimizes amount of clients connected through `EventSource` and `WebSocket` by sharing making one spicific tab primary.
     */
    broadcast = new APIFacadeBroadcast

    subscribe(observer: { next(): void, error(): void }) { }
    // dispose() {}
}

export default APIFacade


class APIFacadeBroadcastMediator {

}

class APIFacadeBroadcast {
    private channel: BroadcastChannel | null
    
    private get disabledLocally(): boolean {
        return !!localStorage.getItem("APIFacadeBroadcast/Flags")?.includes("Disabled")
    }

    constructor(private readonly mediator: APIFacadeBroadcastMediator, private readonly config) { }

    enable() {
        if (this.disabledLocally) return
        
        this.disable()
        this.channel = new BroadcastChannel(APIFacade.name + "://" + this.config.hostname)

        // console.warn(APIFacadeBroadcast.name, " ->", "Bubbling is enabled, this page will recieve events from `EventSource` and `WebSocket` from the primary, so you won't see any reports in devtools.")
    }
    disable() {
        this.channel?.close()
        this.channel = null
    }
}

class APIFacadeEvents {
    on(event: string): Observable { }
}

class APIFacadeSocket {
    on(event: string): Observable { }
    send() {}
}

class APIFacadeSocketIO {
    on(event: string): Observable { }
    exchange<Response>(event: ExchangeEvent<Response>): Promise<Response>
}

class APIFacadeMessages {
    on(event: string): Observable { }
    send() {}
}


abstract class ExchangeEvent<Response = unknown> {
    phase: "request" | "response"
    response: Response | null = null
}

interface User {
    id: string
    name: string
}

class UserUpdateMessage extends ExchangeEvent<User> {
    constructor(readonly userId: string) { super() }
}


const FrameMuseAPI = new APIFacade

FrameMuseAPI.fetch.DELETE["/user/:id"]
FrameMuseAPI.messages.on("USER_UPDATE").subscribe() 
// messagesSharing: { enabled?: true, //segment?(): string }


const socketIO = new APIFacadeSocketIO
const user = await socketIO.exchange(new UserUpdateMessage("jahiosd9u"))
