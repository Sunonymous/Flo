// styling
import './App.css';
// components
import Logo from './Logo';
import LeftPanel from './LeftPanel';
import SettingsMenu from './features/config/ConfigMenu';
import StatsMenu from './features/stats/StatsMenu';
import CallTracker from './CallTracker';
import { Fireworks } from '@fireworks-js/react';
// hooks
import { useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// redux
import { resetCall, startCall, selectCallState } from './features/callState/callStateSlice';
// data
import fireworksSettings from './data/fireworksSettings';
import { initialCallStats } from './features/stats/StatsMenu';
// icons
import { SlCallIn } from 'react-icons/sl';
import { MdSettings } from 'react-icons/md';
import { ImStatsBars } from 'react-icons/im';
import { ToastContext } from './ToastProvider';
import ToastShelf from './ToastShelf';

function App() {
  // eslint-disable-next-line
  const [callStats, setCallStats] = useState(initialCallStats);

  // Toast Context
  const { addToast } = useContext(ToastContext);

  const callState = useSelector(selectCallState);
  const  dispatch = useDispatch();

  const fireworksRef = useRef(null);

  // reset button
  useEffect(() => {
    // Set keybinding for resetting call
    const reset = (e) => {
      if (e.key === "`") dispatch(resetCall());
    };
    document.addEventListener("keyup", resetCall);

    // Stop Fireworks upon Render
    fireworksRef.current.stop();

    return () => document.removeEventListener("keyup", reset);
  });

  // container root class is for Fireworks
  return (
    <div className="App">
      <div>
        <Fireworks
          className="fireworks"
          ref={fireworksRef}
          options={fireworksSettings}
        />
        <header className="App-header">
          <Logo text="flo" font="Kaushan Script" />
          {/* Not on call */}
          {callState === 'idle' && 
            (<button
              className="resetButton noselect"
              onClick={() => {
                addToast('notice', 'Call Started') // used for testing component
                dispatch(startCall())
              }}
            >
              <span style={{ textAlign: 'center' }}>New Call<SlCallIn /></span>
            </button>)}
          {/* On call */}
          {callState !== "idle" && (
            <CallTracker fireworksRef={fireworksRef} />
          )}
        </header>
        {/* Side panels */}
        <LeftPanel tabLabel={"\u2699"} shortcutKey="s" panels={[
          {tab:      (<MdSettings />),
           content:  (<SettingsMenu />),
           shortcut: 's',
          },
          {tab:      (<ImStatsBars />),
           content:  (<StatsMenu />),
           shortcut: 'a',
          },
        ]}>
        </LeftPanel>
      </div>
      <ToastShelf />
    </div>
  );
}

export default App;
