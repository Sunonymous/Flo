import "./Behavior.css";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBehaviorString, selectConfig, setEditBehavior } from "./features/config/configSlice";
import { AiOutlineUndo, AiOutlineSave } from "react-icons/ai";

const splitOnLines = (s) => s.split('\n');

export default function Behavior({ fireworksRef, completedIDs, setCompletedIDs }) {
  const config = useSelector(selectConfig);
  const dispatch = useDispatch();
  const [behaviors, setBehaviors] = React.useState(splitOnLines(config.behaviorString));

  // could preface this variable name with local
  const [behaviorList, setBehaviorList] = React.useState(config.behaviorString);
 
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
  }, [completedIDs, setCompletedIDs]);

  React.useEffect(() => {
    if (completedIDs.length === behaviors.length) fireworksRef.current.launch(3);
  }, [behaviors, completedIDs, fireworksRef, setCompletedIDs]);

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
  }, [behaviorList, setCompletedIDs]);

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

  // if behaviors remain, display them
  // if at least one behavior has been completed, display an undo button
  // display edit mode over behaviors if active
  return (
    <>
      <div className="wrapper">
        {/* Undo Button */}
        {completedIDs.length > 0 && !config.editBehavior && (
          <button className="btn clear noselect" onClick={undoLastAction}>
            <AiOutlineUndo />
          </button>
        )}
        {/* Behaviors */}
        {!config.editBehavior &&
          behaviors.map((b, id) =>
            !completedIDs.includes(id) ? callAction(b, id) : null
          )}
        {/* Edit Window */}
        {config.editBehavior && (
          <div>
            <textarea
              className="behaviorEditor"
              value={behaviorList}
              rows={behaviors.length}
              onChange={(e) => setBehaviorList(e.target.value)}
            ></textarea>
            <div className="btn noselect" onClick={() => {
              dispatch(setBehaviorString(behaviorList));
              dispatch(setEditBehavior(false));
              localStorage.setItem('userData', JSON.stringify(config));
            }}>
              <AiOutlineSave />
            </div>
          </div>
        )}
      </div>
    </>
  );
}