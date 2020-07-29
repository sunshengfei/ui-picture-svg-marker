// MIT License

// Copyright (c) 2018 FredDon

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

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ahaSvg = require('aha-svg');

var _config = require('./config');

var _annoTransformersRect = require('./anno-transformers-rect');

var _annoTransformersCircle = require('./anno-transformers-circle');

var _ahaGraphic = require('aha-graphic');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Movement = function Movement(node) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  var _this = this;

  var boundRect = arguments[2];
  var options = arguments[3];

  _classCallCheck(this, Movement);

  this.transform = function (offsetX, offsetY) {
    if (!_this.options.editable) return;
    var mainRect = _this.moveNode.firstElementChild;
    var shape = mainRect.nodeName;
    if (shape == _config.supportShapes[0]) {
      new _annoTransformersRect.RectAnnoTransformer(_this).transform(offsetX, offsetY);
    } else if (shape == _config.supportShapes[1]) {
      new _annoTransformersCircle.CircleAnnoTransformer(_this).transform(offsetX, offsetY);
    }
  };

  this.moveNode = node;
  this.type = type;
  this.boundRect = boundRect;
  this.options = options;
};

exports.default = Movement;