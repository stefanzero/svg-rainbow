/*
Node program to create an arch of bezeier curves to create a rainbow,
then save it as an external SVG file.
*/

const fs = require("fs");

process.chdir(__dirname);

const colors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#800080",
];

const numColors = colors.length;
const strokeWidth = 20;
const canvasWidth = 1000;
const canvasHeight = 500;

/*
Note: endpoint of the outermost curve must have a padding of one-half the
stroke width, to prevent it from overflowing the canvas.
canvasHeight = canvasWidth / 2
width = canvasWidth - strokeWidth
height = width / 2

Since the y-axis points downward from the top left corner,
the end and top points of the outermost curve are:

x0 = strokeWidth / 2
y0 = canvasHeight
x1 = canvasWidth - strokeWidth / 2
y1 = y0
xtop = canvasWidth / 2
ytop = strokeWidth / 2

Each curve is a separate <path> element with 2 Bezeier curves.
The height of the outmost curve is one-half the distance between
the width of the outmost curve: height = width / 2

The outer Bezier curve is defined by 3 commands:

1. M x0 y0 (to move to the start point), where
   M is the move command
   x0 is the x coordinate of the start point
   y0 is the y coordinate of the start point

2. C cx1, cy1, cx2, cy2, xtop, ytop where
   C is the curve command
   the first control point is cx1 = x0, cy1 = canvasHeight - height / 2
   the second control point is cx2 = (x1 - x0) / 4, cy2 = xtop

3. S cx3, cy3, x1, y1 where
   S is the smooth curve command (the first control point is a reflection of the 
   control point used on the other side to keep the slope constant)
   the next control point is cx3 = x1, cy3 = cy1

There is no fill for any of the curves, and the curve is not closed (no Z command).
The curve is then repeated for each of the other colors.
*/

/* 
First, caclculate the values for the outermost curve, and then loop
through the other colors.
*/
const width = canvasWidth - strokeWidth;
const height = width / 2;
let x0 = strokeWidth / 2;
let y0 = canvasHeight;
let x1 = canvasWidth - strokeWidth / 2;
let y1 = y0;
let xtop = canvasWidth / 2;
let ytop = strokeWidth / 2;
let cx1 = x0;
let cy1 = canvasHeight - height / 2;
let cx2 = x0 + (x1 - x0) / 4;
let cy2 = ytop;
let cx3 = x1;
let cy3 = cy1;

let outerCurve = [
  `      M ${x0} ${y0}`,
  `      C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xtop} ${ytop}`,
  `      S ${cx3} ${cy3}, ${x1} ${y1}`,
].join("\n");

const pathData = [outerCurve];
/*
For each next curve, the values are adjusted as follows:
x0 += strokeWidth
y0 = y0
x1 -= strokeWidth
y1 = y1
xtop = xtop
ytop += strokeWidth
cx1 = x0
cy1 = cy1 + strokeWidth / 2
cx2 = cx2 + strokeWidth / 2
cy2 = cy2 + strokeWidth
cx3 = x1
cy3 = cy1
*/
for (let i = 0; i < numColors - 1; i++) {
  x0 += strokeWidth;
  // y0 = y0;
  x1 -= strokeWidth;
  // y1 = y1;
  xtop = xtop;
  ytop += strokeWidth;
  cx1 = x0;
  cy1 += strokeWidth / 2;
  cx2 += strokeWidth / 2;
  cy2 += strokeWidth;
  cx3 = x1;
  cy3 = cy1;

  let innerCurve = [
    `      M ${x0} ${y0}`,
    `      C ${cx1} ${cy1}, ${cx2} ${cy2}, ${xtop} ${ytop}`,
    `      S ${cx3} ${cy3}, ${x1} ${y1}`,
  ].join("\n");

  pathData.push(innerCurve);
}

let svg = `<svg 
  xmlns="http://www.w3.org/2000/svg"
  x0="0px"
  y0="0px"
  width="${canvasWidth}" 
  height="${canvasHeight}" 
  viewBox="0 0 ${canvasWidth} ${canvasHeight}"
  fill="none"
  stroke="none"
  stroke-width="${strokeWidth}"
  stroke-linecap="square"
  xml:space="preserve"
>\n`;
/*
 Using a pathLength of 100 allows the stroke-dasharray and stroke-dashoffset 
 to be set as a percentage of the length of the path in the keyframe animation.
 */
const pathLength = 100;
pathData.forEach((d, i) => {
  svg += `  <path 
    class="path-${i}"
    stroke="${colors[i]}" 
    stroke-width="${strokeWidth}"
    pathLength="${pathLength}"
    d="
${d}
    " 
  />\n`;
});
svg += "</svg>";
const xml = `<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet type="text/css" href="./svg.css" ?>\n`;
const fileName = `rainbow-${canvasWidth}x${canvasHeight}.svg`;

fs.writeFileSync(fileName, xml.concat(svg));
