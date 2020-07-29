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
exports.transformDataArray = exports.positionP2S = exports.UUID = exports.BdAIMarker = exports.ResizeAnnotation = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _anno = require('./anno');

var _anno2 = _interopRequireDefault(_anno);

var _ahaGraphic = require('aha-graphic');

var _drafthelper = require('./drafthelper');

var _ahaSvg = require('aha-svg');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BdAIMarker = function () {
  function BdAIMarker(layer, draft, resizeAnnotation) {
    var _this = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, BdAIMarker);

    this.eventTargetOnTransform = false;

    this.$callback_handler = function (onTrans) {
      _this.eventTargetOnTransform = onTrans;
    };

    this.setConfigOptions = function (newOptions) {
      _this.options = _extends({}, _this.options, newOptions.options);
      if (_this.resizeAnnotation) {
        _this.resizeAnnotation.setConfigOptions(newOptions);
      }
      _this.currentShape = _this.options.currentShape;
    };

    this.mouseEventHandler = function (e, clientX, clientY) {
      // e.preventDefault();
      // e.stopPropagation();
      var eventType = e.type;
      var boundRect = _this.boundRect();
      if (clientX) {
        _this.moveX = clientX - boundRect.x;
      }
      if (clientY) {
        _this.moveY = clientY - boundRect.y;
      }
      if (eventType === _config.MOUSE_EVENT[6]) {
        _this.eventTargetOnTransform = false;
        _this.actionDown = false;
        _this.resizeAnnotation.dragEventOn(e);
        return;
      }
      if (_this.eventTargetOnTransform) {
        _this.resizeAnnotation.dragEventOn(e);
        return;
      }
      if (eventType === _config.MOUSE_EVENT[0] || eventType === _config.TOUCH_EVENT[0]) {
        if (e.target.classList.contains(_this.options.annotationClass) || e.target.classList.contains('' + _config.PREFIX_RESIZE_DOT)) {
          _this.eventTargetOnTransform = true;
          _this.resizeAnnotation.dragEventOn(e);
          return;
        }
        if (_this.actionDown) {
          _this.drawDraft(_this.moveX, _this.moveY);
          _this.lastX = _this.moveX;
          _this.lastY = _this.moveY;
          return;
        }
        _this.resizeAnnotation.removeSelectedAnnotation();
        _this.actionDown = true;
        _this.anchorX = _this.moveX;
        _this.anchorY = _this.moveY;
        _this.resetDraft();
        _this.draft = (0, _drafthelper.initdraft)(_this.moveX, _this.moveY, _this.currentShape);
        _this.layer.appendChild(_this.draft);
        _this.anchorAt(_this.anchorX, _this.anchorY);
      } else if (eventType === _config.MOUSE_EVENT[1] || eventType === _config.TOUCH_EVENT[1]) {
        if (_this.actionDown) {
          _this.drawDraft(_this.moveX, _this.moveY);
          _this.lastX = _this.moveX;
          _this.lastY = _this.moveY;
        }
      } else if (eventType === _config.MOUSE_EVENT[4] || eventType === _config.TOUCH_EVENT[2] || eventType === _config.TOUCH_EVENT[4]) {
        if (_this.actionDown && _this.resizeAnnotation) {
          _this.resizeAnnotation.drawAnnotation(_this.draftRect, void 0, _this.currentShape);
          _this.resetDraft();
        }
        _this.actionDown = false;
      } else {
        if (_this.actionDown && _this.filterOutOfBounds(_this.moveX, _this.moveY)) {
          // console.log(`eventType=${eventType}`);
          // console.log(this.draftRect);
          if (_this._canDrawDraft(_this.moveX, _this.moveY)) {
            if (_this.resizeAnnotation) {
              _this.resizeAnnotation.drawAnnotation(_this.draftRect, void 0, _this.currentShape);
              _this.resetDraft();
            }
          }
          _this.actionDown = false;
        }
      }
      // console.log(`eventType=${eventType}`);
    };

    this.anchorAt = function (x, y) {
      if (!_this.options.editable) return;
      if (_this.moveX < x) {
        _this.draftRect = Object.assign(_this.draftRect, {
          x: (100 * Math.abs(_this.moveX) / _this.boundRect().width).toFixed(3) + '%'
        });
      } else {
        _this.draftRect = Object.assign(_this.draftRect, {
          x: (100 * Math.abs(x) / _this.boundRect().width).toFixed(3) + '%'
        });
      }
      if (_this.moveY < y) {
        _this.draftRect = Object.assign(_this.draftRect, {
          y: (100 * Math.abs(_this.moveY) / _this.boundRect().height).toFixed(3) + '%'
        });
      } else {
        _this.draftRect = Object.assign(_this.draftRect, {
          y: (100 * Math.abs(y) / _this.boundRect().height).toFixed(3) + '%'
        });
      }
    };

    this.filterOutOfBounds = function (x, y) {
      var boundRect = _this.boundRect();
      return x >= boundRect.width ||
      // x >= this.boundRect().x + this.boundRect().width + 2 ||
      y >= boundRect.height ||
      // y >= this.boundRect().y + this.boundRect().height + 2 ||
      x < 1 || y < 1;
    };

    this.resetDraft = function () {
      //reset
      //删除草稿
      _this.draftRect = { x: -1, y: -1, width: 0, height: 0, cx: 0, cy: 0 };
      if (_this.draft) {
        _this.draft.remove();
      }
      // attrtoSvg(this.draft, this.draftRect);
    };

    this.clearAll = function () {
      var annotations = _this.layer.querySelectorAll('.' + _this.options.annotationClass);
      annotations.forEach(function (item) {
        item.remove();
      });
      _this.renderData(void 0);
    };

    this.drawDraft = function (x, y) {
      if (!_this.options.editable) return;
      if (_this.filterOutOfBounds(x, y)) {
        return;
      }
      if (!_this._canDrawDraft(x, y)) {
        return;
      }
      _this.anchorAt(_this.anchorX, _this.anchorY);
      var rectF = new _ahaGraphic.RectF(_this.anchorX, _this.anchorY, x, y);
      _this.draftRect = Object.assign(_this.draftRect, (0, _drafthelper.draftresize)(rectF, _this.boundRect(), _this.currentShape));
      (0, _ahaSvg.attrtoSvg)(_this.draft, _this.draftRect);
    };

    this.renderData = function () {
      var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var base = arguments[1];

      var ra = _this.resizeAnnotation;
      if (ra) {
        ra.renderData(dataArray, base);
      }
    };

    this.setTag = function (tag) {
      if (_this.resizeAnnotation && tag) {
        _this.resizeAnnotation.setTagForCurrentMovement(tag);
      }
    };

    this.selectMarkerByTagId = function (tagId) {
      if (tagId) {
        _this.resizeAnnotation.selectMarkerByTagId(tagId);
      }
    };

    this.dataSource = function () {
      if (_this.resizeAnnotation) {
        return _this.resizeAnnotation.dataSource();
      }
      return void 0;
    };

    this.dataForTag = function (tagId, uuid) {
      return _this.resizeAnnotation.dataSourceOfTag(tagId, uuid);
    };

    if ((typeof configs === 'undefined' ? 'undefined' : _typeof(configs)) !== 'object') {
      throw 'Please provide a callback Config for BdAIMarker';
    }
    this.options = _extends({}, _config.defaultConfig.options, configs.options);
    this.setConfigOptions({
      options: {
        currentShape: _config.supportShapes[0]
      }
    });
    if (layer) {
      this.lastX = 0;
      this.lastY = 0;
      this.layer = layer;
      this.draft = draft;
      this.markers = [];
      this.actionDown = false;
      this.draftRect = {};
      this.anchorX = -1;
      this.anchorY = -1;
      this.boundRect = function () {
        return layer.getBoundingClientRect();
      };

      var defs = (0, _ahaSvg.toElement)('<defs>\n  <filter x="0" y="0" width="1" height="1" id="tag_op_bg">\n    <feFlood flood-color="#fff"/>\n    <feComposite in="SourceGraphic"/>\n  </filter>\n</defs>');
      this.layer.appendChild(defs);

      this.resizeAnnotation = resizeAnnotation ? resizeAnnotation : new _anno2.default(layer, this.boundRect, configs, this.$callback_handler);
      this.resizeAnnotation.currentShape = this.currentShape;
      var self = this;
      if (this.options.deviceType == 'both' || this.options.deviceType == 'mouse') {
        _config.MOUSE_EVENT.forEach(function (currentValue, index, arr) {
          layer.addEventListener(currentValue, function (e) {
            var x = e.clientX,
                y = e.clientY;
            self.mouseEventHandler(e, x, y);
          }, true);
        });
      }
      if (this.options.deviceType == 'both' || this.options.deviceType == 'touch') {
        _config.TOUCH_EVENT.forEach(function (currentValue, index, arr) {
          layer.addEventListener(currentValue, function (e) {
            if (e.targetTouches) {
              var touch = e.targetTouches[0];
              var x = touch ? touch.clientX : undefined,
                  y = touch ? touch.clientY : undefined;
              self.mouseEventHandler(e, x, y);
            }
          }, true);
        });
      }
    }
  }

  //  更新定位点


  /**
   * 清空数据
   */


  _createClass(BdAIMarker, [{
    key: '_canDrawDraft',
    value: function _canDrawDraft(x, y) {
      if (this.currentShape == _config.supportShapes[1]) {
        var boundRect = this.boundRect();
        //边界判断 demo start FIX BUG
        var cX = this.anchorX * 100 / boundRect.width,
            cY = this.anchorY * 100 / boundRect.height,
            rX = x * 100 / boundRect.width,
            rY = y * 100 / boundRect.height;
        var limitPer = this.options.boundReachPercent || 0;
        var calculateR = Math.sqrt(Math.pow(rX - cX, 2) + Math.pow(rY - cY, 2));
        if (cX - calculateR < limitPer || cX + calculateR > 100 - limitPer) {
          return false;
        }
        if (cY - calculateR < limitPer || cY + calculateR > 100 - limitPer) {
          return false;
        }
      }
      return true;
    }

    /**
     * 渲染数据
     */


    /**
     * 打标签
     * {
     * id:'',
     * name:'',
     * }
     */


    /**
     * 获取所有数据
     */


    /**
     * 获取某个标签的数据
     */

  }]);

  return BdAIMarker;
}();

exports.ResizeAnnotation = _anno2.default;
exports.BdAIMarker = BdAIMarker;
exports.UUID = _config.UUID;
exports.positionP2S = _config.positionP2S;
exports.transformDataArray = _config.transformDataArray;