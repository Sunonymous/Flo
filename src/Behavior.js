import "./Behavior.css";
import React from "react";

const templateBehaviors = "Acknowledge\nProbing Questions\nWhat Else?\nAccount Audit\nNBA\nRecap";

const splitOnLines = (s) => s.split('\n');

export default function Behavior({ resetter, editActive }) {
  const [completedIDs, setCompletedIDs] = React.useState([]);
  // right now behavior state is localized. in the future if this is to be saved to
  // the configuration, something will need to change.
  const [behaviors, setBehaviors] = React.useState(splitOnLines(templateBehaviors));
  const [behaviorList, setBehaviorList] = React.useState(templateBehaviors);

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

  const reset = () => setCompletedIDs([]);
  resetter.on("newCall", reset);

  // returns formatting for individual actions
  const callAction = (behavior, id) => {
    const finishAction = (e) => setCompletedIDs(completedIDs.concat(id));

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
      <p className="infoMessage noselect">
        Behaviors complete! You have mastered the call.
      </p>
    );
  }
  // if behaviors remain, display them
  // if at least one behavior has been completed, display an undo button
  // display edit mode over behaviors if active
  return (
    <>
      {completedIDs.length > 0 && (
        <div className="undoButton noselect" onClick={undoLastAction}>
          {"\u2B6F"}
        </div>
      )}
      <div className="wrapper">
        {!editActive && behaviors.map((b, id) =>
            !completedIDs.includes(id) ? callAction(b, id) : null
          )}
        {editActive && (
          <textarea
            className="behaviorEditor"
            value={behaviorList}
            rows={behaviors.length}
            onChange={(e) => setBehaviorList(e.target.value)}
          ></textarea>
        )}
      </div>
    </>
  );
}