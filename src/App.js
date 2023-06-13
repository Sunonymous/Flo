import './App.css';
import Logo from './Logo';
import Timer from './CallTimer';
import defaultConfig from './data/defaultConfig';
import LeftPanel from './LeftPanel';
import Behavior from './Behavior';
import { useEffect, useState, useRef } from 'react';
import CallResetter from './CallResetter';
import SettingsMenu from './SettingsMenu';
import StatsMenu from './StatsMenu';
import { Fireworks } from '@fireworks-js/react';
import { initialCallStats } from './StatsMenu';
import { SlCallIn } from 'react-icons/sl';
import { MdSettings } from 'react-icons/md';
import { ImStatsBars } from 'react-icons/im';

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

const loadConfig = () => {
  // if local storage has data saved, use that first
  const userData = localStorage.getItem('userData');
  if (userData) {
    console.log('Loading user data.'); 
    return JSON.parse(userData);
  } else {
    console.log('Loading default data.'); 
    return defaultConfig;
  }
}

function App() {
  // eslint-disable-next-line
  const [resetter, setResetter] = useState(new CallResetter());
  const [config, setConfig] = useState(loadConfig());
  // callState :: idle | talking | paused | hold | complete
  const [callState, setCallState] = useState('idle');
  const [callStats, setCallStats] = useState(initialCallStats);

  const fireworksRef = useRef(null);

  const saveBehaviors = (newBehaviors) => {
    const newConfig = {...config, behaviorString: newBehaviors, editBehavior: false};
    setConfig(newConfig);
    localStorage.setItem('userData', JSON.stringify(newConfig));
  }

  useEffect(() => {
    const completeCall = () => {
      console.log("Call completed.");
      if (config.autostartTimer) {
        console.log('Autostarting next call.');
        resetter.emit('newCall');
      } else {
        setCallState('idle');
      }
    };

    const discardCall = () => {
      console.log("Call discarded.");
      setCallState("idle");
    };

    resetter.on("completeCall", completeCall);
    resetter.on("discardCall", discardCall);
   
    return () => {
      resetter.off("completeCall", completeCall);
      resetter.off("discardCall", discardCall);
    };
  }, [config, resetter]);

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
          {callState === 'idle' && <button
            className="resetButton noselect"
            onClick={() => resetter.emit("newCall")}
          >
            <span style={{textAlign: 'center'}}>New Call<SlCallIn /></span>
          </button>}
          {callState !== "idle" && (
            <Behavior
              resetter={resetter}
              config={config}
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
        <LeftPanel tabLabel={"\u2699"} shortcutKey="s" panels={[
          {tab: (<MdSettings />),
           content: (<SettingsMenu config={config} setConfig={setConfig} />),
           shortcut: 's',
          },
          {tab: (<ImStatsBars />),
           content: (<StatsMenu callStats={callStats} setCallStats={setCallStats} config={config} resetter={resetter} />),
           shortcut: 'a',
          },
        ]}>
        </LeftPanel>
      </div>
    </div>
  );
}

export default App;
