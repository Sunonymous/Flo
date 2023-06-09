import "./Behavior.css";
import React from "react";
import { BsCheck2, BsTrash } from 'react-icons/bs';

const splitOnLines = (s) => s.split('\n');

export default function Behavior({ resetter, config, saveFunc, fireworksRef }) {
  const [completedIDs, setCompletedIDs] = React.useState([]);
  // right now behavior state is localized. in the future if this is to be saved to
  // the configuration, something will need to change.
  const [behaviors, setBehaviors] = React.useState(splitOnLines(config.behaviorString));
  const [behaviorList, setBehaviorList] = React.useState(config.behaviorString);
 
  // sub-component for complete/discard buttons
  const CallActions = () => {
    const completeCall = () => {
      const completedBehaviors = completedIDs.map((idx) => behaviors[idx]);
      resetter.emit("completeCall", completedBehaviors);
    };
  
    const discardCall = () => {
      resetter.emit("discardCall");
    };
  
    return (
      <div className="callActions">
        <div className="action success noselect icon" onClick={completeCall}>
          <BsCheck2 className="icon" />
        </div>
        <div className="btn erase noselect icon" onClick={discardCall}>
          <BsTrash className="icon" />
        </div>
      </div>
    );
  };
  
  const undoLastAction = () => {
    setCompletedIDs(completedIDs.slice(0, completedIDs.length - 1));
  };

  // undo keybinding
  React.useEffect(() => {
    const undo = (e) => {
      if (e.key.toLowerCase() === "u") undoLastAction();
    };
    document.addEventListener("keyup", undo);

    return () => document.removeEventListener("keyup", undo);

    // linter complaints that undoLastAction needs to be in dependency array
    // eslint-disable-next-line
  }, [completedIDs]);

  const reset = () => {
    setCompletedIDs([]);
  }
  resetter.on("newCall", reset);

  React.useEffect(() => {
    if (completedIDs.length === behaviors.length) fireworksRef.current.launch(3);
  }, [behaviors, completedIDs, fireworksRef]);

  // returns formatting for individual actions
  const callAction = (behavior, id) => {
    const finishAction = (e) => {
      setCompletedIDs(completedIDs.concat(id));
    }

    return (
      <div className="actionWrapper noselect" key={id} onClick={finishAction}>
        <label className="noselect">{behavior || '(empty)'}</label>
        <br />
      </div>
    );
  };

  React.useEffect(() => {
    const individualActions = splitOnLines(behaviorList);
    setBehaviors(individualActions);
    setCompletedIDs([]);
  }, [behaviorList]);

  // if all behaviors are completed, display such
  if (completedIDs.length === behaviors.length) {
    return (
      <>
        <p className="infoMessage noselect">
          Behaviors complete! You have mastered the call.
        </p>
        <CallActions />
      </>
    );
  }

  // if behaviors remain, display them
  // if at least one behavior has been completed, display an undo button
  // display edit mode over behaviors if active
  return (
    <>
      {completedIDs.length > 0 && !config.editBehavior && (
        <div className="btn noselect" onClick={undoLastAction}>
          {"\u2B6F"}
        </div>
      )}
      <div className="wrapper">
        {!config.editBehavior &&
          behaviors.map((b, id) =>
            !completedIDs.includes(id) ? callAction(b, id) : null
          )}
        {config.editBehavior && (
          <div>
            <textarea
              className="behaviorEditor"
              value={behaviorList}
              rows={behaviors.length}
              onChange={(e) => setBehaviorList(e.target.value)}
            ></textarea>
            <div className="btn noselect" onClick={() => saveFunc(behaviorList)}>
              {"\u2611"}
            </div>
          </div>
        )}
      </div>
      {!config.editBehavior && <CallActions />}
    </>
  );
}