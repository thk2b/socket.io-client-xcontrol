# socket.io-client-xcontrol
A Controller for the socket.io client

# Goal

The goal of this package is to connect a websocket to a controller. Whenever specific actions are caused on a controller instance, messages should be emited through the socket.

# Implementation

The `SocketIo` function takes a Controller class and method names, and returns a new class to be initialized with a socket.
This HOC overides the named methods and emits the method name, arguments and controller name through the socket.
When initialized, the HOC listens for these actions on the socket, and triggers them on the controller when they are recieved.
It also listens for these actions on the controller, and emits them through the socket.

# Usage

```js
import SocketIo from 'socket.io-client-xcontrol'

const ConnectedTodos = SocketIo( Todos , ['create', 'delete', 'update'])

const todos = new ConnectedTodos(socket)
```
Equivalent to:
```js
class Todos extends HashMap {
    constructor(initialState, socket){
      super(initialState)
      this.socket = socket
      socket.on('@@todos__create', args => this.create(args))
    }
    create(...args){
       super.create(...args)
       this.socket.emit('@@todos__create', args)
    }
}
```
