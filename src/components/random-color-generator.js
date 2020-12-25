export const randomColor = () => {
  let colorCode = "#";
  let d1 = Math.floor(Math.random() * 255).toString(16);
  let d2 = Math.floor(Math.random() * 255).toString(16);
  let d3 = Math.floor(Math.random() * 255).toString(16);
  if (d1.length === 1) colorCode += "0" + d1;
  else colorCode += d1;
  if (d2.length === 1) colorCode += "0" + d2;
  else colorCode += d2;
  if (d3.length === 1) colorCode += "0" + d3;
  else colorCode += d3;
  return colorCode;
};

export const inversColor = (colorCode) => {
  let invCode = "#";
  if (colorCode !== null) {
    let decVal = parseInt(colorCode.substr(1, 6), 16);
    console.log("int:: ", decVal);
    let deff = 16777215 - decVal;
    invCode += deff.toString(16);
  } else invCode += "FFFFFF";
  return invCode;
};
