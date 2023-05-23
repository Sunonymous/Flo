import './App.css';
import Logo from './Logo';
import Timer from './CallTimer';
import defaultConfig from './defaultConfig';
import LeftPanel from './LeftPanel';
import Behavior from './Behavior';
import { useEffect, useState } from 'react';
import CallResetter from './CallResetter';
import SettingsMenu from './SettingsMenu';

function App() {
  // eslint-disable-next-line
  const [resetter, setResetter] = useState(new CallResetter());
  const [config, setConfig] = useState(defaultConfig);

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
        <Logo text="flo" />
        <button
          className="resetButton"
          onClick={() => resetter.emit("newCall")}
        >
          New Call
        </button>
        <Behavior resetter={resetter} editActive={config.editBehavior} />
        <Timer
          resetter={resetter}
          autostartTimer={config.autostartTimer}
          alertInterval={config.alertInterval}
        />
      </header>
      <LeftPanel tabLabel={"\u2699"} shortcutKey='s'>
        <SettingsMenu config={config} setConfig={setConfig} />
      </LeftPanel>
    </div>
  );
}

export default App;
