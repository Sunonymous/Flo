import React, { useState } from 'react';
import './LeftPanel.css';

// passed children for props and a string to show on tab
const LeftPanel = ({ children, tabLabel, shortcutKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    const toggleOnKey = (e) => {
      if (e.key === shortcutKey) setIsOpen(!isOpen);
    }

    document.addEventListener('keyup', toggleOnKey);

    return () => document.removeEventListener('keyup', toggleOnKey);
  }, [isOpen, shortcutKey]);

  return (
    <div className={`panel ${isOpen ? "open" : ""}`}>
      <div className="tab" onClick={togglePanel}>
        <span>{tabLabel}</span>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default LeftPanel;
