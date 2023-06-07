import "./Behavior.css";
import React from "react";

// default call types: inbound | outboud | collect
const templateBehaviors = {
  inbound:  "Acknowledge\nProbing Questions\nWhat Else?\nAccount Audit\nNBA\nRecap",
  outbound: "Recap\nRevisit\nPersonal Touch",
  collect:  "Empathy\nFull Balance\nPast Due\n30 Days Past Due\nAnything?",
};
const splitOnLines = (s) => s.split('\n');

export default function Behavior({ resetter, editActive, saveFunc, fireworksRef }) {
  const [callType, setCallType] = React.useState('inbound');
  const [completedIDs, setCompletedIDs] = React.useState([]);
  // right now behavior state is localized. in the future if this is to be saved to
  // the configuration, something will need to change.
  const [behaviors, setBehaviors] = React.useState(splitOnLines(templateBehaviors[callType]));
  const [behaviorList, setBehaviorList] = React.useState(templateBehaviors[callType]);
  
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
      </>
    );
  }

  const switchCallType = (e) => {
    setBehaviorList(templateBehaviors[e.target.value]);
    setBehaviors(splitOnLines(templateBehaviors[e.target.value]));
  }

  // if behaviors remain, display them
  // if at least one behavior has been completed, display an undo button
  // display edit mode over behaviors if active
  return (
    <>
      {/* !editActive && (<select className="callTypeSelector" onChange={switchCallType}>
        {Object.keys(templateBehaviors).map((t) => {
          return <option key={t} value={t}>{t}</option>
        })}
      </select>) */}
      {completedIDs.length > 0 && !editActive && (
        <div className="btn noselect" onClick={undoLastAction}>
          {"\u2B6F"}
        </div>
      )}
      <div className="wrapper">
        {!editActive &&
          behaviors.map((b, id) =>
            !completedIDs.includes(id) ? callAction(b, id) : null
          )}
        {editActive && (
          <>
            <textarea
              className="behaviorEditor"
              value={behaviorList}
              rows={behaviors.length}
              onChange={(e) => setBehaviorList(e.target.value)}
            ></textarea>
            <div className="btn noselect" onClick={saveFunc}>
              {"\u2611"}
            </div>
          </>
        )}
      </div>
    </>
  );
}