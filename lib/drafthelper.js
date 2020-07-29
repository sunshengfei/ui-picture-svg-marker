"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // MIT License

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

exports.initdraft = initdraft;
exports.getShapeAnnoSVGString = getShapeAnnoSVGString;
exports.draftresize = draftresize;
exports.hypotenuse = hypotenuse;
exports.resizeDotPoints = resizeDotPoints;
exports.getFrameData = getFrameData;

var _ahaSvg = require("aha-svg");

var _ahaSvg2 = _interopRequireDefault(_ahaSvg);

var _ahaGraphic = require("aha-graphic");

var _resizedot_rect = require("./resizedot_rect");

var _resizedot_circle = require("./resizedot_circle");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initdraft() {
  var pointX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var pointY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var shape = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rect';

  var svgElement = void 0;
  if (shape == _config.supportShapes[0]) {
    svgElement = (0, _ahaSvg.toElement)("<rect />");
    svgElement = _ahaSvg2.default.selector(svgElement).x(pointX).y(pointY).height(0).width(0).border('#f1f1f1').fill('rgba(0,0,0,0.2)').target;
    return svgElement;
  }
  if (shape == _config.supportShapes[1]) {
    svgElement = (0, _ahaSvg.toElement)("<circle />");
    svgElement = _ahaSvg2.default.selector(svgElement).cx(pointX).cy(pointY).r(0).border('#f1f1f1').fill('rgba(0,0,0,0.2)').target;
    return svgElement;
  }
  var slotString = (0, _ahaSvg.attrstringify)({
    points: pointX + "," + pointY + " " + pointX + "," + (pointY + 1) + " " + (pointX + 1) + "," + pointY,
    style: "stroke: #f1f1f1;fill:rgba(0,0,0,0.2)"
  });
  // debugger
  return (0, _ahaSvg.toElement)("<polygon " + slotString + "/>");
}

function getShapeAnnoSVGString() {
  var rRect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var className = arguments[1];
  var shape = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rect';

  if (shape == _config.supportShapes[0]) {
    var slotString = (0, _ahaSvg.attrstringify)(_extends({}, rRect, {
      style: "stroke: #3e3e3e;fill:rgba(0,0,0,0.2)"
    }));
    return "<rect class=\"" + className + "\" " + slotString + "/>";
  }
  if (shape == _config.supportShapes[1]) {
    var _slotString = (0, _ahaSvg.attrstringify)({
      cx: rRect.cx,
      cy: rRect.cy,
      r: rRect.r, //|| (Math.abs(hypotenuse(rectF.width(), rectF.height())) + '%'),
      style: "stroke: #3e3e3e;fill:rgba(0,0,0,0.2)"
    });
    return "<circle class=\"" + className + "\" " + _slotString + "/>";
  }
}

function draftresize(rRectF, boundRect) {
  var shape = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rect';

  if (shape == _config.supportShapes[0]) {
    var widthRatio = (100 * Math.abs(rRectF.width()) / boundRect.width).toFixed(3);
    var heightRatio = (100 * Math.abs(rRectF.height()) / boundRect.height).toFixed(3);
    return {
      width: widthRatio + '%',
      height: heightRatio + '%'
    };
  }
  var cx = (100 * Math.abs(rRectF.left) / boundRect.width).toFixed(3),
      cy = (100 * Math.abs(rRectF.top) / boundRect.height).toFixed(3);
  if (shape == _config.supportShapes[1]) {
    var radius = Math.abs(hypotenuse(100 * rRectF.width() / boundRect.width, 100 * rRectF.height() / boundRect.height)).toFixed(3);
    //边界判断
    // if (cx - radius < 0.01) {
    //   return {}
    // }
    // if (cx + radius > 100 - 0.01) {
    //   return {}
    // }
    return {
      cx: cx + '%',
      cy: cy + '%',
      r: radius + '%'
    };
  }
  return {};
}

function hypotenuse(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function resizeDotPoints(tag, rRect, boundRect) {
  var shape = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'rect';
  var options = arguments[4];

  if (shape == _config.supportShapes[0]) {
    return (0, _resizedot_rect.resizeDot)(tag, rRect, boundRect, options);
  }
  if (shape == _config.supportShapes[1]) {
    return (0, _resizedot_circle.resizeDot)(tag, rRect, boundRect, options);
  }
}

function getFrameData(mainElement) {
  var shape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'rect';

  shape = shape || mainElement.nodeName;
  if (shape == _config.supportShapes[0]) {
    return {
      x: mainElement.getAttribute('x'),
      y: mainElement.getAttribute('y'),
      x1: (parseFloat(mainElement.getAttribute('width')) + parseFloat(mainElement.getAttribute('x'))).toFixed(3) + '%',
      y1: (parseFloat(mainElement.getAttribute('height')) + parseFloat(mainElement.getAttribute('y'))).toFixed(3) + '%'
    };
  }
  if (shape == _config.supportShapes[1]) {
    return {
      x: mainElement.getAttribute('cx'),
      y: mainElement.getAttribute('cy'),
      r: parseFloat(mainElement.getAttribute('r')) + '%'
    };
  }
}