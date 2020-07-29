'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resizeDot = resizeDot;

var _ahaGraphic = require('aha-graphic');

var _config = require('./config');

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
  var tagId = _ref.tagId,
      tagString = _ref.tagString;

  var pRect = new _ahaGraphic.Rect(parseFloat(rRect.x), parseFloat(rRect.y), parseFloat(rRect.width), parseFloat(rRect.height));
  var collectionArr = [];
  var radius = 4;
  var fontSize = 12,
      operPadding = 4;
  //rRect 为百分比单位
  // 先去掉所有的%
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
      x: pRect.x, y: pRect.y + pRect.height - (fontSize + operPadding) * 100 / boundRect.height
    }
  };

  var i = 0;
  for (var prop in _config.resizeDotClasses) {
    var point = resizeDotPoints[prop];
    if (i === 8) {
      var className = '' + (options.blurOtherDotsShowTags ? '' : _config.dotCls[i] + ' ') + _config.resizeDotClasses[prop];
      var trashclassName = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
      var dotTemplate = '<g class="' + className + '" data-tid="' + tagId + '" filter="url(#tag_op_bg)" >\n              <svg x="' + point.x.toFixed(3) + '%" y="' + point.y.toFixed(3) + '%" width="100%">\n              <text class="' + trashclassName + '" dx="0" dy="' + (fontSize - operPadding / 2) + '" font-size="' + fontSize + '" height="' + fontSize + '" style="stroke-width:0;">X</text>\n              <text dx="' + (operPadding / 2 + fontSize) + '" dy="' + (fontSize - operPadding / 2) + '" font-size="' + fontSize + '" height="' + fontSize + '" style="stroke-width:0;" class="' + _config.imageOpTag + '">' + tagString + '</text>\n              </svg>\n              </g>';
      collectionArr.push(dotTemplate);
    } else {
      var _className = _config.resizeDotClasses[prop] + ' ' + _config.dotCls[i] + ' ' + (options.editable ? '' : 'hidden');
      var _dotTemplate = '<circle class="' + _className + '" cx="' + point.x.toFixed(3) + '%" cy="' + point.y.toFixed(3) + '%" r="' + radius + '" style="stroke:#006600; fill:#00cc00"/>';
      collectionArr.push(_dotTemplate);
    }
    i++;
  }
  return collectionArr;
}