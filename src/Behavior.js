import "./Behavior.css";
import React from "react";

const templateBehaviors = [
  "Personalized Greeting",
  "Recognize Effort",
  "Probe to Understand",
  "Acknowledge",
  "Own and Verify",
  "Early What Else?",
  "Resolve Issues",
  "NBA",
  "Verbal/Visual Audit",
  "Recap",
  "Personalized Close",
];

export default function Behavior({ resetter }) {
  const [completedIDs, setCompletedIDs] = React.useState([]);

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

  const callAction = (behavior, id) => {
    const finishAction = (e) => setCompletedIDs(completedIDs.concat(id));

    return (
      <div className="actionWrapper" key={id} onClick={finishAction}>
        <label className="actionLabel">{behavior}</label>
        <br />
      </div>
    );
  };

  // if there are no behaviors, let user know
  if (templateBehaviors.length === 0) {
    return (
      <p className="infoMessage">No behaviors are present... what do we do?</p>
    );
  }

  // if all behaviors are completed, display such
  if (completedIDs.length === templateBehaviors.length) {
    return (
      <p className="infoMessage">
        Behaviors complete! You have mastered the call.
      </p>
    );
  }
  // if behaviors remain, display them
  // if at least one behavior has been completed, display an undo button
  return (
    <>
      {completedIDs.length > 0 && (
        <div className="undoButton" onClick={undoLastAction}>
          {"\u2B6F"}
        </div>
      )}
      <div className="wrapper">
        {templateBehaviors.map((b, id) =>
          !completedIDs.includes(id) ? callAction(b, id) : null
        )}
      </div>
    </>
  );
}