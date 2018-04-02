import test from 'tape'
import sinon from 'sinon'
import HashMap from 'xcontrol/lib/models/HashMap'

import SocketIoController from '../'

class FakeSocket {
    constructor(spy){
        this._events = {}
        this.spy = spy
    }
    hasListener(eventName){
        if(typeof this._events[eventName] === 'function') return
        throw new Error(`FakeSocket dosen't have a listener for the ${eventName} event`)
    }
    recieveFake(eventName, data){
        this.hasListener(eventName)
        this._events[eventName](data)
    }
    emit(eventName, data){
        this.hasListener(eventName)
        this.spy(eventName, data)
    }
    on(eventName, cb){
        this._events[eventName] = cb
    }
    removeListener(eventName, handler){
        const actualHandler = this._events[eventName]
        if( actualHandler === handler){
            delete this._events[eventName]
        }
    }
}

class TestController extends HashMap {
    constructor(initialState){
        super(initialState)
        this._nextId = 0
    }ß
}

test('SocketIoController', main => {
    const TestSocketIoController = SocketIoController( TestController, ['set', 'delete'] )
    main.test('constructor', t => {
        const s = new FakeSocket()
        const c = new TestSocketIoController(undefined, s)
        t.end()
    })
    main.test('emitting events', t => {
        const spy = sinon.spy()
        const s = new FakeSocket(spy)
        const c = new TestSocketIoController(undefined, s)
        const value = { 123: test }
        c.set(value)
        t.ok(spy.calledOnce, 'should have emited an event to the socket')
        t.ok(spy.calledWith('@@TestController__set', [value]), 'should have sent the right data')
        t.end()
    })
    main.test('recieving events', t => {
        const spy = sinon.spy()
        const s = new FakeSocket(spy)
        const c = new TestSocketIoController({ 321: 'test' }, s)
        s.recieveFake('@@TestController__delete', ['321'])
        t.deepEqual(c.store, {}, 'should have deleted the element')
        t.end()
    })
    main.test('removing listeners', t => {
        const spy = sinon.spy()
        const s = new FakeSocket(spy)
        const c = new TestSocketIoController(undefined, s)
        c.removeSocketListeners()
        t.deepEqual(s._events, {}, 'should have remove the event handlers from the socket')
        t.end()
    })
    main.test('listening for an undefined method', t => {
        try {
            new ( SocketIoController( TestController, ['wrong'] ))()
            t.fail('should have thrown')
        } catch(e) {
            t.end()
        }
    })
})