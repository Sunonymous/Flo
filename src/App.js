import './App.css';
import Timer from './CallTimer';
import { useEffect, useState } from 'react';
import Behavior from './Behavior';

class CallResetter {
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
    this.events.splice(indexToRemove, 1);
  }

  emit(event, data) {
    if (!this.events[event]) {
      return;
    }
    const handlers = this.events[event];
    for (const handler of handlers) { handler(data) }
  }
}

function App() {
  // eslint-disable-next-line
  const [resetter, setResetter] = useState(new CallResetter());

  // reset button
  useEffect(() => {
    const resetCall = (e) => {
      if (e.key === '`') resetter.emit('newCall');
    }
    document.addEventListener('keyup', resetCall)

    return () => document.removeEventListener('keyup', resetCall);
  });

  return (
    <div className="App">
      <header className="App-header">
        <button className='resetButton' onClick={() => resetter.emit('newCall')}>New Call</button>
        <Behavior resetter={resetter} />
        <Timer    resetter={resetter} />
      </header>
    </div>
  );
}

export default App;
