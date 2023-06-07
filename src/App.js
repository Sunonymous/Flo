import './App.css';
import Logo from './Logo';
import Timer from './CallTimer';
import defaultConfig from './defaultConfig';
import LeftPanel from './LeftPanel';
import Behavior from './Behavior';
import { useEffect, useState, useRef } from 'react';
import CallResetter from './CallResetter';
import SettingsMenu from './SettingsMenu';
import { Fireworks } from '@fireworks-js/react';

// for further customization, visit:
// https://github.com/crashmax-dev/fireworks-js#fireworks-jsreact
const fireworksSettings = {
  opacity: 0.5,
  traceSpeed: 3,
  explosion: 10,
  brightness: {min: 45, max: 60},
  delay: {min: 65, max: 80},
  particles: 100, 
}

function App() {
  // eslint-disable-next-line
  const [resetter, setResetter] = useState(new CallResetter());
  const [config, setConfig] = useState(defaultConfig);
  // callState :: idle | talking | paused | hold | complete
  const [callState, setCallState] = useState('idle');

  const fireworksRef = useRef(null);

  const saveBehaviors = (e) => setConfig({...config, editBehavior: false});

  // reset button
  useEffect(() => {
    const resetCall = (e) => {
      if (e.key === "`") resetter.emit("newCall");
    };
    document.addEventListener("keyup", resetCall);

    // Stop Fireworks upon Render
    fireworksRef.current.stop();

    return () => document.removeEventListener("keyup", resetCall);
  });

  // container root class is for Fireworks
  return (
    <div className="App">
      <div className="fireworks">
        <Fireworks
          className="fireworks"
          ref={fireworksRef}
          options={fireworksSettings}
        />
        <header className="App-header">
          <Logo text="flo" font="Kaushan Script" />
          <button
            className="resetButton noselect"
            onClick={() => resetter.emit("newCall")}
          >
            {callState === "idle" ? "Start Call" : "New Call"}
          </button>
          {callState !== "idle" && (
            <Behavior
              resetter={resetter}
              editActive={config.editBehavior}
              fireworksRef={fireworksRef}
              saveFunc={saveBehaviors}
            />
          )}
          <Timer
            resetter={resetter}
            autostartTimer={config.autostartTimer}
            alertInterval={config.alertInterval}
            callState={callState}
            setCallState={setCallState}
          />
        </header>
        <LeftPanel tabLabel={"\u2699"} shortcutKey="s">
          <SettingsMenu config={config} setConfig={setConfig} />
        </LeftPanel>
      </div>
    </div>
  );
}

export default App;
