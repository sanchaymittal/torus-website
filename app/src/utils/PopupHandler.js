import { EventEmitter } from 'events'

import StreamWindow from './StreamWindow'

class PopupHandler extends EventEmitter {
  constructor({ url, target, features, preopenInstanceId }) {
    super()
    this.url = url instanceof URL ? url.href : url
    this.target = target || '_blank'
    this.features = features || 'directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200'
    this.window = undefined
    this.windowTimer = {}
    this.iClosedWindow = false
    this.preopenInstanceId = preopenInstanceId
    this._setupTimer()
  }

  _setupTimer() {
    this.windowTimer = setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer)
        if (!this.iClosedWindow) {
          this.emit('close')
        }
        this.iClosedWindow = false
        this.window = undefined
      }
      if (this.window === undefined) clearInterval(this.windowTimer)
    }, 500)
  }

  open() {
    if (!this.preopenInstanceId) {
      this.window = window.open(this.url, this.target, this.features)
      if (!this.window) {
        this.window = new StreamWindow(undefined, this.url)
      }
      return Promise.resolve()
    }
    this.window = new StreamWindow(this.preopenInstanceId)
    return this.window.open(this.url)
  }

  close() {
    this.iClosedWindow = true
    if (this.window) this.window.close()
  }
}

export default PopupHandler
