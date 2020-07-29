"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeDot = resizeDot;

var _ahaGraphic = require("aha-graphic");

var _config = require("./config");

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

function resizeDot(_ref, rRect, boundRect, options) {
  var tagString = _ref.tagString;

  var rectF = new _ahaGraphic.RectF(parseFloat(rRect.cx), parseFloat(rRect.cy), parseFloat(rRect.cx) + parseFloat(rRect.r), parseFloat(rRect.cy) + parseFloat(rRect.r));
  var collectionArr = [];
  var radius = 4;
  var fontSize = 12,
      operPadding = 4;
  //rRect 为百分比单位
  // 先去掉所有的%
  var prop = "right";
  var point = {
    x: rectF.right,
    y: rectF.top
  };
  var className = _config.resizeDotClasses[prop] + " " + _config.dotCls[3] + " " + (options.editable ? '' : 'hidden');
  var dotTemplate = "<circle class=\"" + className + "\" cx=\"" + point.x.toFixed(3) + "%\" cy=\"" + point.y.toFixed(3) + "%\" r=\"" + radius + "\" style=\"stroke:#006600; fill:#00cc00\"/>";
  collectionArr.push(dotTemplate);
  var classNameT = "" + (options.blurOtherDotsShowTags ? '' : _config.dotCls[8] + " ") + _config.resizeDotClasses['trash'];
  var trashclassName = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
  var dotTemplateT = "<g class=\"" + classNameT + "\" filter=\"url(#tag_op_bg)\" style=\"stroke-width:0;fill: #000000\">\n              <svg x=\"" + (rectF.left - rectF.width()).toFixed(3) + "%\" y=\"" + rectF.bottom.toFixed(3) + "%\" width=\"100%\">\n              <text class=\"" + trashclassName + "\" dx=\"" + operPadding + "\" dy=\"" + (fontSize - operPadding / 2) + "\" font-size=\"" + fontSize + "\" height=\"" + fontSize + "\" style=\"stroke-width:0;\">X</text>\n              <text dx=\"" + (operPadding / 2 + fontSize) + "\" dy=\"" + (fontSize - operPadding / 2) + "\" font-size=\"" + fontSize + "\" height=\"" + fontSize + "\" style=\"stroke-width:0;\" class=\"" + _config.imageOpTag + "\">" + tagString + "</text>\n              </svg>\n              </g>";
  collectionArr.push(dotTemplateT);
  return collectionArr;
}