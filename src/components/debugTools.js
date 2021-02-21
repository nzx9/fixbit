export const DEBUG_PRINT = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};

export const convertToLocalTime = (dateTime, notStanderdFormat = true) => {
  if (dateTime !== null && dateTime !== undefined) {
    if (notStanderdFormat) {
      // works for 2021-02-21 04:01:19
      // convert to 2021-02-21T04:01:19.000000Z format before convert to local time
      const splited = dateTime.split(" ");
      let convertedDateTime = `${splited[0]}T${splited[1]}.000000Z`;
      const date = new Date(convertedDateTime);
      return date.toString();
    } else {
      // works for 2021-02-20T17:52:45.000000Z or  1613639329186
      const date = new Date(dateTime);
      return date.toString();
    }
  } else {
    return "Unknown";
  }
};
