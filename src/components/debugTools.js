export const DEBUG_PRINT = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};

export const convertToLocalTime = (date_time, utc = true) => {
  if (date_time !== null && date_time !== undefined) {
    let date = new Date(date_time);
    if (utc) date = new Date(date_time + " UTC");
    return date.toString();
  } else {
    return "Unknown";
  }
};
