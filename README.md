# Project Overview

## Technologies

- Node
- SVG
- HTML
- CSS

## Description

This [GitHub project](https://github.com/stefanzero/svg-rainbow) creates an SVG file to represent a rainbow, and demonstrates how to apply a CSS keyframe animation to a SVG.

## Node Program

### Program Inputs

- Width of SVG
- The height is automatically set to one half of the width
- An array of colors for the rainbow
- The stroke width for each curved path

### Program Outputs

- An SVG file that contains XML markup and an svg element
- The XML file specifies a link to an external CSS file svg.css
- The children of the svg element are a series of path elements
- Each path element has a path data attribute that specifies a Bezier curve
- Each Bezier curve has 3 commands:
  - M: move to the starting point
  - C: a Bezier curve with 2 control points and an end point
  - S: a smooth Bezier curve with 1 control point and end point
- Each path element has a stroke-width attribute that specifies the width
- The paths have the pathLength attribute set to 100 which allows CSS rules to animate the stroke-dashoffset
- The paths have no fill attribute
- The paths are not closed and terminate at the end point

## HTML

This web page is found in the file [index.html](index.html)

- An object element is used to display the SVG file in the web page, since this allows the SVG to be styled with CSS
- The object element has a type attribute set to `image/svg+xml` and data attribute set to the name of the SVG file `rainbow-1000x500.svg`

## CSS

The file [svg.css](svg.css) is used to style the SVG

- A CSS rule for all path elements specifies a stroke-dasharray = 100
- The stroke-dashoffset is also set to 100. This causes the dash to start at the end of the path, so the stroke displays the blank part of the dash.
- A CSS rule for all path elements specifies an animation which changes the stroke-dashoffset from 100 to 0
- The animation has properties for the duration, timing function, direction, and iteration count
- The duration is set to 10 seconds
- The timing function is set to ease-in-out, which changes the speed of the animation to be the slowest at the beginning and the end, and fastest in the middle
- The direction is set to alternate, which causes the animation to alternate between forward and reverse
- The iteration count is set to infinite, which causes the animation to repeat indefinitely
