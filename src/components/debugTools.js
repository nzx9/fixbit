export const DEBUG_PRINT = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};
