import React, { useState } from 'react';
import './LeftPanel.css';

// passed children for props and a string to show on tab
const LeftPanel = ({ children, tabLabel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className={`panel ${isOpen ? "open" : ""}`}>
      <div className="tab" onClick={togglePanel}>
        <span>{"\u2699"}</span>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default LeftPanel;
