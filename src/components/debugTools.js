export const DEBUG_PRINT = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};

export const convetToLocalTime = (date_time) => {
  let date = new Date(date_time);
  return date.toString();
};
