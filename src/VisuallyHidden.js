import React from 'react';
import './VisuallyHidden.css';

const VisuallyHidden = ({
  children,
  className = '',
  ...delegated
}) => {
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const handleKeyDown = (ev) => {
        if (ev.key === 'Alt') {
          setForceShow(true);
        }
      };

      const handleKeyUp = () => {
        setForceShow(false);
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, []);

  if (forceShow) {
    return <span className='showVisuallyWrapper'>{children}</span>;
  }

  return (
    <span className={`${className} visuallyHiddenWrapper`} {...delegated}>
      {children}
    </span>
  );
};

export default VisuallyHidden;
