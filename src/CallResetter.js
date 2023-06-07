export default class CallResetter {
  constructor() {
    this.events = {};
  }

  on(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event, handler) {
    if (!this.events[event]) {
      return;
    }
    const indexToRemove = this.events[event].indexOf(handler);
    this.events[event].splice(indexToRemove, 1);
  }

  emit(event, data) {
    if (!this.events[event]) {
      return;
    }
    const handlers = this.events[event];
    for (const handler of handlers) { handler(data) }
  }
}
