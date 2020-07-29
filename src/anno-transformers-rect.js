// MIT License

// Copyright (c) 2020 FredDon

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { toElement, attrtoSvg, attrstringify } from "aha-svg";
import { RectF, Rect } from "aha-graphic";
import { resizeDot as resizeRectDot } from "./resizedot_rect"
import { resizeDot as resizeCircleDot } from "./resizedot_circle"
import { resizeDotClasses, dotCls } from "./config"
export const supportShapes = [
  "rect",
  "circle",
  "polygon"
]

export class RectAnnoTransformer {
  constructor(movement) {
    this.movement = movement
  }

  transform = (offsetX, offsetY) => {
    if (!this.movement.options.editable) return;
    let mainRect = this.movement.moveNode.firstElementChild
    const rawHeightp = parseFloat(mainRect.getAttribute('height'));
    const rawWidthp = parseFloat(mainRect.getAttribute('width'));
    const rawTop = parseFloat(mainRect.getAttribute('y'));
    const rawLeft = parseFloat(mainRect.getAttribute('x'));

    const heightOffset = 100 * offsetY / this.movement.boundRect.height;
    const widthOffset = 100 * offsetX / this.movement.boundRect.width;
    // console.log( `this.movement.type=${this.movement.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);
    if (rawTop + heightOffset < this.movement.options.boundReachPercent || rawTop + heightOffset > (100 - this.movement.options.boundReachPercent)) {
      return;
    }
    let rRect = {}
    if (this.movement.type === 0) {
      //top
      if (rawHeightp - heightOffset < this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%'
      }
    } else if (this.movement.type === 1) {
      //bottom
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%'
      }
    }
    else if (this.movement.type === 2) {
      //left
      if (widthOffset + rawLeft < this.movement.options.boundReachPercent || widthOffset + rawLeft >= rawWidthp + rawLeft) {
        return;
      }
      rRect = {
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      }
    }
    else if (this.movement.type === 3) {
      //right
      rRect = {
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      }
    } else if (this.movement.type === 4) {
      //top-left
      if (rawHeightp - heightOffset < this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      }
    }
    else if (this.movement.type === 5) {
      //top-right
      if (rawWidthp + widthOffset < this.movement.options.boundReachPercent) {
        return;
      }
      if (rawHeightp - heightOffset < this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%',
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      }
    }
    else if (this.movement.type === 6) {
      //bottom-left
      if (rawHeightp + heightOffset < this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      }
    }
    else if (this.movement.type === 7) {
      //bottom-right
      if (rawHeightp + heightOffset < this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp + widthOffset < this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%',
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      }
    } else if (this.movement.type === -1) {
      // //move
      if (heightOffset + rawTop < this.movement.options.boundReachPercent || heightOffset + rawTop + rawHeightp > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      if (widthOffset + rawLeft < this.movement.options.boundReachPercent || widthOffset + rawLeft + rawWidthp > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      rRect = {
        top: (heightOffset + rawTop).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%',
      }
    }
    if (this.movement.moveNode.tagName == 'g' && mainRect) {
      if (rRect.left) {
        rRect.x = rRect.left
        delete rRect.left
      }
      if (rRect.top) {
        rRect.y = rRect.top
        delete rRect.top
      }
      attrtoSvg(mainRect, {
        ...rRect
      });
      let pRect = new Rect(
        parseFloat(rRect.x || rawLeft),
        parseFloat(rRect.y || rawTop),
        parseFloat(rRect.width || rawWidthp),
        parseFloat(rRect.height || rawHeightp)
      )
      this._transitionDots(pRect)
    }
  };


  _transitionDots = (pRect = {}) => {
    const radius = 4
    let fontSize = 12, operPadding = 4
    let rr = this.movement.boundRect
    const resizeDotPoints = {
      top: {
        x: pRect.x + pRect.width * 0.5, y: pRect.y
      },
      bottom: {
        x: pRect.x + pRect.width * 0.5, y: pRect.y + pRect.height
      },
      left: {
        x: pRect.x, y: pRect.y + pRect.height * 0.5
      },
      right: {
        x: pRect.x + pRect.width, y: pRect.y + pRect.height * 0.5
      },
      topLeft: {
        x: pRect.x, y: pRect.y
      },
      topRight: {
        x: pRect.x + pRect.width, y: pRect.y
      },
      bottomLeft: {
        x: pRect.x, y: pRect.y + pRect.height
      },
      bottomRight: {
        x: pRect.x + pRect.width, y: pRect.y + pRect.height
      },
      trash: {
        x: pRect.x, y: pRect.y + pRect.height - (fontSize + operPadding) * 100 / rr.height
      }
    }
    let i = 0;
    for (let prop in resizeDotClasses) {
      let point = resizeDotPoints[prop]
      if (i === 8) {
        let groupSvg = this.movement.moveNode.querySelector(`svg`)
        attrtoSvg(groupSvg, {
          x: `${point.x.toFixed(2)}%`,
          y: `${point.y.toFixed(2)}%`
        })
      } else {
        let className = `${resizeDotClasses[prop]} ${dotCls[i]}`;
        let cName = className.split(" ").join(".")
        let circle = this.movement.moveNode.querySelector(`.${cName}`)
        attrtoSvg(circle, {
          cx: `${point.x.toFixed(2)}%`,
          cy: `${point.y.toFixed(2)}%`
        })
      }
      i++;

    }
  }
}
