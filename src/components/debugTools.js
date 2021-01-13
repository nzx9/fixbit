export const DEBUG_PRINT = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};

export const convertToLocalTime = (date_time) => {
  if (date_time !== null && date_time !== undefined) {
    let date = new Date(date_time);
    return date.toString();
  } else {
    return "Unknown";
  }
};
