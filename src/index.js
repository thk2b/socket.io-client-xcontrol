export default (Controller, methods = []) => {
    return class SocketIoController extends Controller {
        constructor(initialState, socket=null){
            super(initialState)
            this.socket = socket
            this._listeners = {}

            methods.forEach(
                methodName => {
                    if(Controller.prototype[methodName] === undefined){
                        throw new Error(
                            `Error in SocketIoController:\n
                            ${Controller.name} does not have a ${methodName} method`
                        )
                    }
                    const eventName = `@@${Controller.name}__${methodName}`
                    const handler = args => {
                        Controller.prototype[methodName].call(this, ...args)
                    }
                    socket.on(eventName, handler)
                    this._listeners[eventName] = handler

                    SocketIoController.prototype[methodName] = function(...args){
                        socket.emit(eventName, args)
                        Controller.prototype[methodName](args)
                    }
                }
            )
        }
        initSocket(socket){
            this.socket = socket
        }
        removeSocketListeners(){
            Object.entries(this._listeners).forEach(
                ([ eventName, handler ]) => {
                    this.socket.removeListener(eventName, handler)
                }
            )
            this._listeners = {}
        }
    }
}