import './LeftPanel.css';
import React, { useState } from 'react';

// must be given an array containing special panel objects
// they look like {
// {
//   shortcut: 's',
//   content: (<p>Whatever you need!</p>),
//   tab: (<p>{'\u002B'}</p>),
// }
// 

// passed children for props and a string to show on tab
const LeftPanel = ({ panels }) => {
  const                 [isOpen, setIsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(0);

  const togglePanel = (idx) => {
    setContentVisible(idx);
    setIsOpen(!isOpen);
  }

  const clickOnBackdrop = (e) => {
    if (Array.from(e.target.classList).includes('backdrop')) {
      setIsOpen(false); 
    }
  }

  React.useEffect(() => {
    const toggleOnKey = (e) => {
      const togglePanelKeyboard = () => setIsOpen(!isOpen);

      panels.forEach((panel, idx) => {
        if (
          e.key === panel.shortcut &&
          document.activeElement.nodeName !== "TEXTAREA"
        ) {
          setContentVisible(idx);
          togglePanelKeyboard(); 
        }
      });
    };

    document.addEventListener('keyup', toggleOnKey);

    return () => document.removeEventListener('keyup', toggleOnKey);
  }, [isOpen, panels]);

  const Tab = (panel, idx) => {
    return (
      <div
        key={idx}
        className={`tab ${isOpen && contentVisible !== idx ? "hidden" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          togglePanel(idx);
        }}
      >
        <div className="tabContent">{panel.tab}</div>
      </div>
    );
  }

  return (
    <div
      className={`backdrop ${isOpen ? "open" : ""}`}
      onClick={clickOnBackdrop}
    >
      <div className={`panel ${isOpen ? "open" : ""}`}>
        <div className="allTabs">
          {panels.map(Tab)}
        </div>
        <em className="tooSmall">~ Please widen browser to display panel content. ~</em>
        <div className="content">
          {panels[contentVisible].content}
          </div>
      </div>
    </div>
  );
};

export default LeftPanel;
