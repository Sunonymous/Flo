import "./Behavior.css";
import React from "react";
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from "react-redux";
import { setBehaviorString, selectConfig, setEditBehavior } from "./features/config/configSlice";
import { AiOutlineUndo, AiOutlineSave } from "react-icons/ai";
import { selectHasLocalStorage } from "./features/hasLocalStorage/hasLocalStorageSlice";

const splitOnLines = (s) => s.split('\n');

export default function Behavior({ fireworksRef, completedBehaviors, setCompletedBehaviors }) {
  const   config = useSelector(selectConfig);
  const dispatch = useDispatch();
  const hasLocalStorage = useSelector(selectHasLocalStorage);
  const [behaviors, setBehaviors] = React.useState(splitOnLines(config.behaviorString));

  // could preface this variable name with local
  const [behaviorList, setBehaviorList] = React.useState(config.behaviorString);
 
  const undoLastAction = () => {
    setCompletedBehaviors(completedBehaviors.slice(0, completedBehaviors.length - 1));
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
  }, [completedBehaviors, setCompletedBehaviors]);

  React.useEffect(() => {
    if (completedBehaviors.length === behaviors.length) fireworksRef.current.launch(3);
  }, [behaviors, completedBehaviors, fireworksRef, setCompletedBehaviors]);

  // returns formatting for individual actions
  const callAction = (behavior, id) => {
    // are empty behaviors really that useful?
    if (behavior.trim().length === 0) return null;

    const finishAction = (e) => {
      setCompletedBehaviors(completedBehaviors.concat(behavior));
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
    setCompletedBehaviors([]);
  }, [behaviorList, setCompletedBehaviors]);
 
  // if user has deleted all behaviors and edit window is disabled
  if (behaviors.length === 1 && behaviors[0] === '' && !config.editBehavior) {
    return (
    <>
      <p className="infoMessage noselect">
        No behaviors are listed.
      </p>
    </>);
  }

  // if all behaviors are completed, display such
  if (completedBehaviors.length === behaviors.length) {
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
      <motion.div
        className="wrapper"
        initial={{ opacity: 0, y: 75 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: "easeOut", duration: 1.5 }}
      >
        {/* Undo Button */}
        {completedBehaviors.length > 0 && !config.editBehavior && (
          <button className="btn clear noselect" onClick={undoLastAction}>
            <AiOutlineUndo />
          </button>
        )}
        {/* Behaviors */}
        {!config.editBehavior &&
          behaviors.map((b, id) =>
            !completedBehaviors.includes(b) ? callAction(b, id) : null
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
            <div
              className="btn noselect"
              onClick={() => {
                dispatch(setBehaviorString(behaviorList));
                dispatch(setEditBehavior(false));
                if (hasLocalStorage) {
                  // manual additions to localStorage because these updates don't seem to register fast enough
                  localStorage.setItem(
                    "userData",
                    JSON.stringify({
                      ...config,
                      behaviorString: behaviorList,
                      editBehavior: false })
                  );
                }
              }}
            >
              <AiOutlineSave />
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}