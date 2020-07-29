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

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('./config');

var _movement = require('./movement');

var _movement2 = _interopRequireDefault(_movement);

var _ahaSvg = require('aha-svg');

var _ahaGraphic = require('aha-graphic');

var _drafthelper = require('./drafthelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResizeAnnotation = function ResizeAnnotation(parentNode, boundRect) {
    var _this = this;

    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _config.defaultConfig;
    var callback_handler = arguments[3];

    _classCallCheck(this, ResizeAnnotation);

    this._event = function () {
        if (_this.options.supportDelKey) {
            document.addEventListener("keydown", _this.delEvent);
        } else {
            document.removeEventListener("keydown", _this.delEvent);
        }
    };

    this._uiconstruct = function () {
        if (_this.annotationContainer) {
            var imageOpContents = _this.annotationContainer.querySelectorAll('.' + _config.imageOpContent);
            for (var index = 0; index < imageOpContents.length; index++) {
                var opContent = imageOpContents[index];
                if (!_this.options.showTags) {
                    opContent.style.visibility = 'collapse';
                } else {
                    opContent.style.visibility = 'visible';
                }
                if (_this.options.tagLocation == _config.defaultPositions.out_bottom) {
                    opContent.style.position = 'absolute';
                    opContent.style.bottom = null;
                } else {
                    opContent.style.position = null;
                }
            }
        }
        //
        if (_this.currentMovement && !_this.options.editable) {
            _this.currentMovement.moveNode.querySelectorAll('[class*=' + _config.PREFIX_RESIZE_DOT + ']').forEach(function (node) {
                if (node.classList.contains(_config.dotCls[8])) {
                    node.classList.remove('hidden');
                } else {
                    node.classList.add('hidden');
                }
            });
        }
    };

    this.setConfigOptions = function (newOptions) {
        _this.options = _extends({}, _this.options, newOptions.options);
        _this.rawConfig = _extends({}, _this.rawConfig, newOptions);
        _this._event();
        _this._uiconstruct();
    };

    this.dataTemplate = function (tagObject, rRect) {
        if (!/^.+$/gi.test(tagObject.tag)) {
            tagObject.tag = 'temp@' + new Date().getTime();
        }
        var shape = tagObject.shape;
        var position = null;
        if (shape == _config.supportShapes[0]) {
            var pRect = new _ahaGraphic.Rect(parseFloat(rRect.x), parseFloat(rRect.y), parseFloat(rRect.width), parseFloat(rRect.height));
            var rectF = pRect.mapToRectF();
            position = {
                x: rectF.left + "%",
                y: rectF.top + "%",
                x1: rectF.right + "%",
                y1: rectF.bottom + "%"
            };
        } else if (shape == _config.supportShapes[1]) {
            position = {
                x: rRect.cx,
                y: rRect.cy,
                r: rRect.r
            };
        }
        return _extends({}, tagObject, {
            position: position
        });
    };

    this.reset = function () {
        _this.data = [];
    };

    this.isValid = function (rect) {
        return rect && (parseFloat(rect.width) > 1 && parseFloat(rect.height) > 1 || parseFloat(rect.r) > 1);
    };

    this.renderData = function () {
        var dataArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { width: _this.boundRect().width, height: _this.boundRect().height };

        if (dataArray instanceof Array && dataArray.length > 0) {
            dataArray.forEach(function (data, index, arr) {
                var rect = void 0;
                if (data.position.x.endsWith('%')) {
                    rect = {
                        x: data.position.x,
                        y: data.position.y,
                        width: parseFloat(data.position.x1) - parseFloat(data.position.x) + '%',
                        height: parseFloat(data.position.y1) - parseFloat(data.position.y) + '%'
                    };
                } else {
                    rect = {
                        x: (100 * data.position.x / base.width).toFixed(3) + '%',
                        y: (100 * data.position.y / base.height).toFixed(3) + '%',
                        width: (100 * (data.position.x1 - data.position.x) / base.width).toFixed(3) + '%',
                        height: (100 * (data.position.y1 - data.position.y) / base.height).toFixed(3) + '%'
                    };
                }
                _this.drawAnnotation(rect, data, data.shape);
            });
        } else {
            _this.reset();
        }
        _this.rawConfig.onAnnoDataFullLoaded();
    };

    this.dataSource = function () {
        return _this.data;
    };

    this.dataSourceOfTag = function (tagId, uuid) {
        for (var i = 0; i < _this.data.length; i++) {
            var value = _this.data[i];
            if (value.tag === tagId && value.uuid == uuid) {
                return value;
            }
        }
    };

    this.setTagForCurrentMovement = function (tagOb) {
        if (_this.currentMovement) {
            var node = _this.currentMovement.moveNode;
            var tag_str = '',
                tag_id = '';
            if (typeof tagOb === 'string') {
                tag_id = tag_str = tagOb;
            }
            var oldtag = node.dataset.id;
            var constData = {};
            if ((typeof tagOb === 'undefined' ? 'undefined' : _typeof(tagOb)) === 'object') {
                tag_str = tagOb['tagName'];
                tag_id = tagOb['tag'];
                constData = _extends({}, tagOb);
            }
            var uuid = node.dataset.uuid;
            //svg has no `innerText` 
            node.querySelector('.' + _config.imageOpTag).innerHTML = tag_str;
            for (var i = 0; i < _this.data.length; i++) {
                var value = _this.data[i];
                var oldValue = Object.assign({}, value);
                if (value.tag === oldtag && value.uuid === uuid) {
                    value = _extends({}, value, constData, {
                        tag: tag_id,
                        tagName: tag_str
                    });
                    node.dataset.id = tag_id;
                    node.dataset.name = tag_str;
                    _this.rawConfig.onAnnoChanged(value, oldValue);
                    _this.data[i] = value;
                }
            }
            _this.rawConfig.onUpdated(_this.dataSource());
        }
    };

    this.updateMovementData = function () {
        //获取tag
        if (_this.currentMovement == null) return;
        var node = _this.currentMovement.moveNode;
        var uuid = node.dataset.uuid;
        // querySelector(`.${imageOpTag}`)
        var tag = node.dataset.id;
        var mainElement = node.firstElementChild;
        //从原有的数据集查找该tag 
        var changed = false;
        for (var i = 0; i < _this.data.length; i++) {
            var value = _this.data[i];
            var oldValue = Object.assign({}, value);
            if (value.tag === tag && value.uuid === uuid) {
                var position = (0, _drafthelper.getFrameData)(mainElement, value.shape);
                if (JSON.stringify(value.position) != JSON.stringify(position)) {
                    value.position = position;
                    _this.data[i] = value;
                    changed = true;
                    _this.rawConfig.onAnnoChanged(value, oldValue);
                }
                break;
            }
        }
        if (changed) {
            _this.rawConfig.onUpdated(_this.dataSource(), _this.currentMovement);
        }
    };

    this._removeAnnotationEvent = function (e) {
        if (!_this.options.editable) return;
        var selectNode = e.currentTarget.parentNode.parentNode.parentNode;
        _this.removeAnnotation(selectNode);
    };

    this.removeAnnotation = function (node) {
        if (node) {
            var uuid = node.dataset.uuid;
            // const tag = node.querySelector(`.${imageOpTag}`).dataset.id;
            var value = void 0;
            for (var i = 0; i < _this.data.length; i++) {
                value = _this.data[i];
                if ( //value.tag === tag && 
                value.uuid === uuid) {
                    if (_this.rawConfig.onAnnoRemoved(value)) {
                        _this.data.splice(i, 1);
                    }
                    break;
                }
            }
            _this.rawConfig.onUpdated(_this.dataSource());
            node.remove();
        }
    };

    this.drawAnnotation = function (rRect) {
        var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
        var shape = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "rect";

        // debugger
        if (!_this.isValid(rRect)) {
            return;
        }
        _this.removeSelectedAnnotation();
        //创建Annotation节点
        // annotationContainer
        //边框
        var rr = _this.boundRect();
        //region
        var collectionArr = [];
        var rectStr = (0, _drafthelper.getShapeAnnoSVGString)(rRect, _this.options.annotationClass + ' selected', shape);
        collectionArr.push(rectStr);
        // let rSize = {
        //     x: isNaN(rRect.x) ? parseFloat(rRect.x) * 0.01 * rRect.width : rRect.x,
        //     y: isNaN(rRect.y) ? parseFloat(rRect.y) * 0.01 * rRect.height : rRect.y,
        //     height: rr.height * 0.01 * parseFloat(rRect.height),
        //     width: rr.width * 0.01 * parseFloat(rRect.width),
        // }
        var uu = '' + (0, _config.UUID)(16, 16);
        var tagString = void 0,
            tagId = void 0;
        if ((typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) === 'object') {
            tagString = tag.tagName;
            tagId = tag.tag;
        } else if (typeof tag === 'string') {
            tagString = tag;
            tagId = tag;
        } else {
            tagString = '请选择或添加新标签';
            tagId = 'temp@' + uu;
        }
        tag = _extends({}, tag, {
            tag: tagId,
            tagName: tagString,
            shape: shape
        });
        var pRect = new _ahaGraphic.Rect(parseFloat(rRect.x), parseFloat(rRect.y), parseFloat(rRect.width), parseFloat(rRect.height));
        var arr = (0, _drafthelper.resizeDotPoints)({ tagId: tagId, tagString: tagString }, rRect, rr, shape, _this.options);
        collectionArr.push.apply(collectionArr, _toConsumableArray(arr));
        var annotation = (0, _ahaSvg.toElement)('<g>' + collectionArr.join('') + '</g>'); //group
        if (annotation) {
            var del = annotation.querySelector('.g-image-op-del');
            if (del) {
                del.addEventListener('click', _this._removeAnnotationEvent, true);
            }
        } else {
            return;
        }
        annotation.dataset.shape = shape;
        annotation.dataset.uuid = uu;
        annotation.dataset.id = tagId;
        _this.annotationContainer.appendChild(annotation);
        // for (let prop in resizeDotClasses) {
        //     let resizeDot = document.createElement('div');
        //     if (i === 8) {
        //         resizeDot.className = `${this.options.blurOtherDotsShowTags
        //             ? ''
        //             : `${dotCls[i]}`} ${resizeDotClasses[prop]}`;
        //         let opContent = document.createElement('div');
        //         opContent.className = imageOpContent;
        //         if (!this.options.showTags) {
        //             opContent.style.visibility = 'collapse';
        //         } else {
        //             opContent.style.visibility = 'visible';
        //         }
        //         if (this.options.tagLocation == defaultPositions.out_bottom) {
        //             opContent.style.position = 'absolute';
        //             opContent.style.bottom = null;
        //         } else {
        //             opContent.style.position = null;
        //         }
        //         let trash = document.createElement('i');
        //         trash.className = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
        //         trash.innerText = ' × ';
        //         trash.addEventListener('click', this._removeAnnotationEvent, true);
        //         let tag = document.createElement('span');
        //         tag.dataset.name = tagString;
        //         tag.className = `${imageOpTag}`;
        //         tag.innerText = tagString;
        //         tag.dataset.id = tagId;
        //         if (this.options.trashPositionStart) {
        //             opContent.appendChild(trash);
        //             opContent.appendChild(tag);
        //         } else {
        //             opContent.appendChild(tag);
        //             opContent.appendChild(trash);
        //         }
        //         resizeDot.appendChild(opContent);
        //     } else {
        //         resizeDot.className = `${resizeDotClasses[prop]} ${dotCls[i]} ${this.options.editable
        //             ? ''
        //             : 'hidden'}`;
        //     }
        //     annotation.appendChild(resizeDot);
        //     i++;
        // }
        // //加事件
        annotation.oncontextmenu = function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            var node = e.currentTarget;
            var tagAttr = node.querySelector('.' + _config.imageOpTag).dataset;
            var ab = _this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);
            _this.rawConfig.onAnnoContextMenu(ab, node, _this);
            // this.removeAnnotation(node);
            return true;
        };
        _this.currentMovement = new _movement2.default(annotation, 0, _this.boundRect(), _this.options);
        // this.selectAnnotation();
        var dts = _this.dataTemplate(tag, rRect);
        var insertItem = _extends({}, dts, { uuid: uu });
        _this.data.push(insertItem);
        _this.rawConfig.onAnnoAdded(insertItem, annotation);
        _this.rawConfig.onUpdated(_this.dataSource());
    };

    this.dragEventOn = function (e) {
        // e.preventDefault();
        // e.stopPropagation();
        // if (!e.target.classList.contains('annotation') &&
        // !e.target.classList.contains(`${PREFIX_RESIZE_DOT}`)) {
        //     eventTargetOnTransform = false;
        //   }
        var eventType = e.type;
        // console.log(`eventType=${eventType}`);
        if (eventType === _config.MOUSE_EVENT[6]) {
            _this.selectAnnotation();
            return;
        }
        var clientX = e.clientX,
            clientY = e.clientY;
        if (e.targetTouches && e.targetTouches.length > 0) {
            var touch = e.targetTouches[0];
            clientX = touch ? touch.clientX : undefined;
            clientY = touch ? touch.clientY : undefined;
        }
        _this.moveX = clientX; //- this.boundRect().x;
        _this.moveY = clientY; //- this.boundRect().y;
        if (eventType === _config.MOUSE_EVENT[0] || eventType === _config.TOUCH_EVENT[0]) {
            _this.actionDown = true;
            _this.lastX = _this.moveX;
            _this.lastY = _this.moveY;
            if (typeof _this.callback_handler === 'function') {
                _this.callback_handler(true);
            }
            // eventTargetOnTransform = true;
            _this.targetEventType(e);
        } else if (eventType === _config.MOUSE_EVENT[1] || eventType === _config.MOUSE_EVENT[3] || eventType === _config.MOUSE_EVENT[5] || eventType === _config.TOUCH_EVENT[1] || eventType === _config.TOUCH_EVENT[3] || eventType === _config.TOUCH_EVENT[5]) {
            if (_this.currentMovement == null) {
                return true;
            }
            if (_this.actionDown) {
                if (_this.filterOutOfBounds(_this.moveX, _this.moveY)) {
                    return;
                }
                _this.currentMovement.transform(_this.moveX - _this.lastX, _this.moveY - _this.lastY);
                _this.lastX = _this.moveX;
                _this.lastY = _this.moveY;
            }
        } else {
            if (typeof _this.callback_handler === 'function') {
                _this.callback_handler(false);
            }
            // eventTargetOnTransform = false;
            if (_this.actionDown) {
                _this.updateMovementData();
                _this.selectAnnotation();
            }
            _this.actionDown = false;
        }
    };

    this.removeSelectedAnnotation = function () {
        if (_this.currentMovement) {
            var cs = _this.currentMovement.moveNode.classList;
            cs.remove('selected');
            if (_this.options.blurOtherDots) {
                _this.currentMovement.moveNode.querySelectorAll('[class*=' + _config.PREFIX_RESIZE_DOT + ']').forEach(function (node) {
                    if (node.classList.contains(_config.dotCls[8])) {} else {
                        node.classList.add('hidden');
                    }
                });
            }
            // fix unselect mv can be deleted
            _this.currentMovement = null;
        }
    };

    this.selectAnnotation = function () {
        var isUserinteracted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (_this.currentMovement) {
            var cs = _this.currentMovement.moveNode.classList;
            cs.add('selected');
            if (_this.options.blurOtherDots) {
                if (!_this.options.editable) {
                    _this.currentMovement.moveNode.querySelectorAll('[class*=' + _config.PREFIX_RESIZE_DOT + ']').forEach(function (node) {
                        if (node.classList.contains(_config.dotCls[8])) {
                            node.classList.remove('hidden');
                        } else {
                            node.classList.add('hidden');
                        }
                    });
                    return;
                }
                _this.currentMovement.moveNode.querySelectorAll('[class*=' + _config.PREFIX_RESIZE_DOT + ']').forEach(function (node) {
                    node.classList.remove('hidden');
                });
            }
            if (!isUserinteracted) return;
            var node = _this.currentMovement.moveNode;
            // const tag_str = node.querySelector(`.${imageOpTag}`).innerText;
            var tagAttr = node.dataset;
            var selectData = _extends({}, tagAttr, _this.dataSourceOfTag(tagAttr.id, tagAttr.uuid));
            _this.rawConfig.onAnnoSelected(selectData, node);
        }
    };

    this.selectMarkerByTagId = function (tagId) {
        var tag = _this.annotationContainer.querySelector('[data-id="' + tagId + '"]');
        if (tag) {
            var markerAnnotation = tag.parentNode.parentNode.parentNode;
            _this.removeSelectedAnnotation();
            _this.currentMovement = new _movement2.default(markerAnnotation, -1, _this.boundRect(), _this.options);
            _this.selectAnnotation(false);
        }
    };

    this.targetEventType = function (e) {
        _this.removeSelectedAnnotation();
        var el = e.target;
        var parentEl = el.classList.contains('annotation') ? el.parentNode : el.parentNode;
        if (el.classList.contains(_config.dotCls[0])) {
            //top
            _this.currentMovement = new _movement2.default(parentEl, 0, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[1])) {
            //bottom
            _this.currentMovement = new _movement2.default(parentEl, 1, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[2])) {
            //left
            _this.currentMovement = new _movement2.default(parentEl, 2, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[3])) {
            //right
            _this.currentMovement = new _movement2.default(parentEl, 3, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[4])) {
            //top-left
            _this.currentMovement = new _movement2.default(parentEl, 4, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[5])) {
            //top-right
            _this.currentMovement = new _movement2.default(parentEl, 5, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[6])) {
            //bottom-left
            _this.currentMovement = new _movement2.default(parentEl, 6, _this.boundRect(), _this.options);
        } else if (el.classList.contains(_config.dotCls[7])) {
            //bottom-right
            _this.currentMovement = new _movement2.default(parentEl, 7, _this.boundRect(), _this.options);
        } else if (el.classList.contains('annotation')) {
            _this.currentMovement = new _movement2.default(parentEl, -1, _this.boundRect(), _this.options);
        } else {
            _this.currentMovement = null;
        }
        // this.selectAnnotation();
    };

    this.filterOutOfBounds = function (x, y) {
        return x >= _this.boundRect().x + _this.boundRect().width + 2 || y >= _this.boundRect().y + _this.boundRect().height + 2 || x < 5 || y < 5;
    };

    this.options = _extends({}, _config.defaultConfig.options);
    this.currentShape = '';
    this.rawConfig = _extends({}, _config.defaultConfig);
    this.callback_handler = callback_handler;
    this.annotationContainer = parentNode;
    this.boundRect = boundRect;
    this.actionDown = false;
    this.currentMovement = null;
    this.data = [];
    var that = this;
    this.delEvent = function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
            var currentMovement = that.currentMovement;
            if (currentMovement) {
                that.removeAnnotation(currentMovement.moveNode);
            }
        }
    };
    this.setConfigOptions(callback);
}

//获取数据模板


//init
;

exports.default = ResizeAnnotation;