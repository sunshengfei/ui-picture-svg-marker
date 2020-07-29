"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleAnnoTransformer = exports.supportShapes = undefined;

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

var CircleAnnoTransformer = exports.CircleAnnoTransformer = function CircleAnnoTransformer(movement) {
  var _this = this;

  _classCallCheck(this, CircleAnnoTransformer);

  this.transform = function (offsetX, offsetY) {
    if (!_this.movement.options.editable) return;
    var frame = _this.movement.boundRect;
    var mainRect = _this.movement.moveNode.firstElementChild;
    var r = parseFloat(mainRect.getAttribute('r'));
    var cy = parseFloat(mainRect.getAttribute('cy'));
    var cx = parseFloat(mainRect.getAttribute('cx'));
    var box = mainRect.getBBox();
    var boundry = new _ahaGraphic.RectF(100 * box.x / frame.width, 100 * box.y / frame.height, 100 * (box.width + box.x) / frame.width, 100 * (box.height + box.y) / frame.height);
    var heightOffset = 100 * offsetY / _this.movement.boundRect.height;
    var widthOffset = 100 * offsetX / _this.movement.boundRect.width;
    // console.log( `this.movement.type=${this.movement.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);
    if (boundry.top + heightOffset < _this.movement.options.boundReachPercent || boundry.top + heightOffset > 100 - _this.movement.options.boundReachPercent) {
      return;
    }
    var rRect = {};
    if (_this.movement.type === 3) {
      //right
      if (-heightOffset + boundry.top < _this.movement.options.boundReachPercent || heightOffset + boundry.bottom > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      if (-widthOffset + boundry.left < _this.movement.options.boundReachPercent || widthOffset + boundry.right > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        r: (r + widthOffset).toFixed(3) + '%'
      };
    } else if (_this.movement.type === -1) {
      //move
      if (heightOffset + boundry.top < _this.movement.options.boundReachPercent || heightOffset + boundry.bottom > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      if (widthOffset + boundry.left < _this.movement.options.boundReachPercent || widthOffset + boundry.right > 100 - _this.movement.options.boundReachPercent) {
        return;
      }
      rRect = {
        cy: (heightOffset + cy).toFixed(3) + '%',
        cx: (widthOffset + cx).toFixed(3) + '%'
      };
    }
    if (_this.movement.moveNode.tagName == 'g' && mainRect) {
      (0, _ahaSvg.attrtoSvg)(mainRect, _extends({}, rRect));
      var pRect = new _ahaGraphic.Rect(parseFloat(rRect.cx || cx), parseFloat(rRect.cy || cy), parseFloat(rRect.r || r), parseFloat(rRect.r || r));
      _this._transitionDots(pRect);
    }
  };

  this._transitionDots = function () {
    var pRect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var moveNode = _this.movement.moveNode;
    var prop = "right";
    var className = _config.resizeDotClasses[prop] + " " + _config.dotCls[3];
    var cName = className.split(" ").join(".");
    var circle = moveNode.querySelector("." + cName);
    (0, _ahaSvg.attrtoSvg)(circle, {
      cx: (pRect.x + pRect.width).toFixed(2) + "%",
      cy: pRect.y.toFixed(2) + "%"
    });

    var groupSvg = moveNode.querySelector("svg");
    (0, _ahaSvg.attrtoSvg)(groupSvg, {
      x: (pRect.x - pRect.width).toFixed(2) + "%",
      y: (pRect.y + pRect.height).toFixed(2) + "%"
    });
  };

  this.movement = movement;
};