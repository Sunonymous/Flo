const SECONDS_IN_MINUTE = 60;

// integer -> string
const prefixWithZero = (n) => n < 10 ? '0' + n : String(n);

// integer -> string
function formatTime(seconds) {
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    return minutes > 0 ? 
           `${minutes}:${prefixWithZero(seconds % SECONDS_IN_MINUTE)}`
         : `${seconds} `;
}

function formatLapse(seconds) {
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
    return minutes > 0 ? 
           `${minutes} min. ${prefixWithZero(seconds % SECONDS_IN_MINUTE)} sec.`
         : `${seconds} sec.`;
}

const timeFormatter = {
  clock: formatTime,
  words: formatLapse,
};

export default timeFormatter;