import './ReminderMenu.css';
import React from 'react';
import { ToastContext } from '../../ToastProvider';
import { useDispatch, useSelector } from 'react-redux';
import { selectReminders, addReminder, removeReminder } from './remindersSlice';

// used to stagger removing state and preventing multiple toasts from popping simultaneously
const STAGGER_DELAY = 1000;

// toasts don't function well when scheduled at the exact same second
// could add reminder saving into redux slice
// timeout is scheduled here, interval is saved into object with message
// can also check to see if anything is scheduled for that minute,
//   and if so, then timeout should be rescheduled for some milliseconds later
//   to prevent scheduling two+ toasts simultaneously

const ScheduleReminderForm = () => {
    const    { addToast } = React.useContext(ToastContext);
    const    [reminderTime,    setReminderTime] = React.useState('');
    const [reminderMessage, setReminderMessage] = React.useState('');
    const dispatch = useDispatch();
    const reminders = useSelector(selectReminders);

    const clearForm = () => {
      setReminderTime('');
      setReminderMessage('');
    }

    const handleCreateReminder = (e) => {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0); 

        const differenceInMS = reminderDate - Date.now();
        if (differenceInMS < 0 || reminderMessage.trim().length === 0) return;

        const timeToStagger = reminders.filter((rem) => rem.at === reminderTime).length * STAGGER_DELAY;

        const removeInMS = differenceInMS + STAGGER_DELAY;
        const intervalID = setTimeout(() => addToast('notice', 'Reminder: "' + reminderMessage + '"'), differenceInMS + timeToStagger);
        const removalID  = setTimeout(() => dispatch(removeReminder(intervalID)), removeInMS);
        dispatch(addReminder({ id: intervalID, at: reminderTime, msg: reminderMessage, clearID: removalID }));
        clearForm();
    }

    const          now = new Date();
    const  padWithZero = (n) => Number(n) < 10 ? '0' + n : n;
    const acceptedHour = padWithZero(now.getHours());
    const  acceptedMin = padWithZero(now.getMinutes() + 1);

    return (
      <form className="createReminderForm" onSubmit={(e) => e.preventDefault()}>
        <h4>Schedule Reminder</h4>
        <label>
          Time:{" "}
          <input
            type="time"
            min={`${acceptedHour}:${acceptedMin}`}
            onChange={(e) => setReminderTime(e.target.value)}
            value={reminderTime}
          />
        </label>
        <br />
        <label>
          Message:{" "}
          <input
            required
            type="text"
            minLength={1}
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
        </label>
        <div className="createReminderFormButtons">
          <button disabled={reminderTime.trim().length < 1} onClick={handleCreateReminder}>Save</button>{" "}
          <button onClick={clearForm}>Clear</button>
        </div>
      </form>
    );
}

const ReminderEditor = ({ reminders }) => {
  const dispatch = useDispatch();

  const SingleReminder = (rem) => {
    const destroyReminder = () => {
      clearTimeout(rem.id);
      dispatch(removeReminder(rem.id));
    };

    return (
      <li key={rem.id} className='singleReminder'>
        <span   className='reminderAt'>{rem.at}</span>
        <span   className='reminderMsg'>{rem.msg}</span>
        <button className='removeReminderBtn' onClick={destroyReminder}>X</button>
      </li>
    )
  }

  return (
    <section className='reminderEditor'>
      <h4>Open Reminders</h4>
      <ul>
        {reminders.map(SingleReminder)}
      </ul>
    </section>
  );
}

const ReminderMenu = () => {
  const reminders = useSelector(selectReminders);

  return (
    (
      <div>
        <h2>Reminders</h2>
        <hr />
        <ScheduleReminderForm />
        {reminders.length > 0 && <ReminderEditor reminders={reminders} />}
      </div>
    )
  );
};

export default ReminderMenu;