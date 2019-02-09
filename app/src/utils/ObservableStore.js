const EventEmitter = require('events')

/*
Obervable store taken from packabe obs-store and written to adhere to 
Torus build process for Composable store
*/
class ObservableStore extends EventEmitter {
  constructor(initState = {}) {
    super()
    // set init state
    this._state = initState
  }

  // wrapper around internal getState
  getState() {
    return this._getState()
  }

  // wrapper around internal putState
  putState(newState) {
    this._putState(newState)
    this.emit('update', newState)
  }

  updateState(partialState) {
    // if non-null object, merge
    if (partialState && typeof partialState === 'object') {
      const state = this.getState()
      const newState = Object.assign({}, state, partialState)
      this.putState(newState)
      // if not object, use new value
    } else {
      this.putState(partialState)
    }
  }

  // subscribe to changes
  subscribe(handler) {
    this.on('update', handler)
  }

  // unsubscribe to changes
  unsubscribe(handler) {
    this.removeListener('update', handler)
  }

  //
  // private
  //

  // read from persistence
  _getState() {
    return this._state
  }

  // write to persistence
  _putState(newState) {
    this._state = newState
  }
}

export default ObservableStore
