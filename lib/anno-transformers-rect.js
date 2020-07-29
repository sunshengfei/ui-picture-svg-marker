"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RectAnnoTransformer = exports.supportShapes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ahaSvg = require("aha-svg");

var _ahaGraphic = require("aha-graphic");

var _resizedot_rect = require("./resizedot_rect");

var _resizedot_circle = require("./resizedot_circle");

var _config = require("./config");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // MIT License

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

var supportShapes = exports.supportShapes = ["rect", "circle", "polygon"];

var RectAnnoTransformer = exports.RectAnnoTransformer = function RectAnnoTransformer(movement) {
  var _this = this;

  _classCallCheck(this, RectAnnoTransformer);

  this.transform = function (offsetX, offsetY) {
    if (!_this.movement.options.editable) return;
    var mainRect = _this.movement.moveNode.firstElementChild;
    var rawHeightp = parseFloat(mainRect.getAttribute('height'));
    var rawWidthp = parseFloat(mainRect.getAttribute('width'));
    var rawTop = parseFloat(mainRect.getAttribute('y'));
    var rawLeft = parseFloat(mainRect.getAttribute('x'));

    var heightOffset = 100 * offsetY / _this.movement.boundRect.height;
    var widthOffset = 100 * offsetX / _this.movement.boundRect.width;
    // console.log( `this.movement.type=${this.movement.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);
    if (rawTop + heightOffset < _this.movement.options.boundReachPercent || rawTop + heightOffset > 100 - _this.movement.options.boundReachPercent) {
      return;
    }
    var rRect = {};
    if (_this.movement.type === 0) {
      //top
      if (rawHeightp - heightOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 1) {
      //bottom
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 2) {
      //left
      if (widthOffset + rawLeft < _this.movement.options.boundReachPercent || widthOffset + rawLeft >= rawWidthp + rawLeft) {
        return;
      }
      rRect = {
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 3) {
      //right
      rRect = {
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 4) {
      //top-left
      if (rawHeightp - heightOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 5) {
      //top-right
      if (rawWidthp + widthOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      if (rawHeightp - heightOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (rawTop + heightOffset).toFixed(3) + '%',
        height: (rawHeightp - heightOffset).toFixed(3) + '%',
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 6) {
      //bottom-left
      if (rawHeightp + heightOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%',
        width: (rawWidthp - widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === 7) {
      //bottom-right
      if (rawHeightp + heightOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      if (rawWidthp + widthOffset < _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        height: (rawHeightp + heightOffset).toFixed(3) + '%',
        width: (rawWidthp + widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === -1) {
      // //move
      if (heightOffset + rawTop < _this.movement.options.boundReachPercent || heightOffset + rawTop + rawHeightp > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      if (widthOffset + rawLeft < _this.movement.options.boundReachPercent || widthOffset + rawLeft + rawWidthp > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        top: (heightOffset + rawTop).toFixed(3) + '%',
        left: (widthOffset + rawLeft).toFixed(3) + '%'
      };
    }
    if (_this.movement.moveNode.tagName == 'g' && mainRect) {
      if (rRect.left) {
        rRect.x = rRect.left;
        delete rRect.left;
      }
      if (rRect.top) {
        rRect.y = rRect.top;
        delete rRect.top;
      }
      (0, _ahaSvg.attrtoSvg)(mainRect, _extends({}, rRect));
      var pRect = new _ahaGraphic.Rect(parseFloat(rRect.x || rawLeft), parseFloat(rRect.y || rawTop), parseFloat(rRect.width || rawWidthp), parseFloat(rRect.height || rawHeightp));
      _this._transitionDots(pRect);
    }
  };

  this._transitionDots = function () {
    var pRect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var radius = 4;
    var fontSize = 12,
        operPadding = 4;
    var rr = _this.movement.boundRect;
    var resizeDotPoints = {
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
    };
    var i = 0;
    for (var prop in _config.resizeDotClasses) {
      var point = resizeDotPoints[prop];
      if (i === 8) {
        var groupSvg = _this.movement.moveNode.querySelector("svg");
        (0, _ahaSvg.attrtoSvg)(groupSvg, {
          x: point.x.toFixed(2) + "%",
          y: point.y.toFixed(2) + "%"
        });
      } else {
        var className = _config.resizeDotClasses[prop] + " " + _config.dotCls[i];
        var cName = className.split(" ").join(".");
        var circle = _this.movement.moveNode.querySelector("." + cName);
        (0, _ahaSvg.attrtoSvg)(circle, {
          cx: point.x.toFixed(2) + "%",
          cy: point.y.toFixed(2) + "%"
        });
      }
      i++;
    }
  };

  this.movement = movement;
};