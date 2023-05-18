import './Behavior.css';
import React from 'react';

const templateBehaviors = [
    'Personalized Greeting',
    'Recognize Effort',
    'Own and Verify',
    'Probe to Understand',
    'Acknowledge',
    'Early What Else?',
    'Resolve',
    'NBA',
    'Verbal/Visual Audit',
    'Recap',
    'Personalized Close',
];


export default function Behavior({ resetter }) {
    const [completedIDs, setCompletedIDs] = React.useState([]);

    const reset = () => setCompletedIDs([]);
    resetter.on('newCall', reset);

    const callAction = (behavior, id) => {
        const elementID = "action-" + id;
        
        // triggered on input change, passed event obj
        const finishAction = (e) => {
            if (e.target.checked) {
            setCompletedIDs(completedIDs.concat(id));
            }
        };
        
        return (
        <div className="actionWrapper" key={id}>
            <input
            className='actionBox'
            id={elementID}
            type='checkbox'
            onChange={finishAction}
            />
            <label className='actionLabel' htmlFor={elementID}>{behavior}</label>
            <br />
        </div>
        );
    };

    // if there are no behaviors, let user know
    if (templateBehaviors.length === 0) {
        return (
          <p className="infoMessage">
            No behaviors are present... what do we do?
          </p>
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
    return (
        <form className='wrapper'>
            {templateBehaviors.map((b, id) => 
                 !completedIDs.includes(id) ? callAction(b, id) : null
            )}
        </form>
    )
}