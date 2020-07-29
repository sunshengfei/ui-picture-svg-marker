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

import { Rect, RectF } from "aha-graphic";
import {
  MOUSE_EVENT,
  TOUCH_EVENT,
  dotCls,
  imageOpTag,
  imageOpContent,
  PREFIX_RESIZE_DOT,
  defaultPositions,
  defaultConfig,
  resizeDotClasses,
  UUID
} from './config';
export function resizeDot({ tagString }, rRect, boundRect, options) {
  let rectF = new RectF(
    parseFloat(rRect.cx),
    parseFloat(rRect.cy),
    parseFloat(rRect.cx) + parseFloat(rRect.r),
    parseFloat(rRect.cy) + parseFloat(rRect.r),
  )
  let collectionArr = []
  const radius = 4
  let fontSize = 12, operPadding = 4
  //rRect 为百分比单位
  // 先去掉所有的%
  let prop = "right"
  let point = {
    x: rectF.right,
    y: rectF.top
  }
  let className = `${resizeDotClasses[prop]} ${dotCls[3]} ${options.editable ? '' : 'hidden'}`;
  let dotTemplate = `<circle class="${className}" cx="${point.x.toFixed(3)}%" cy="${point.y.toFixed(3)}%" r="${radius}" style="stroke:#006600; fill:#00cc00"/>`
  collectionArr.push(dotTemplate)
  let classNameT = `${options.blurOtherDotsShowTags ? ''
    : `${dotCls[8]} `}${resizeDotClasses['trash']}`;
  let trashclassName = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
  let dotTemplateT =
    `<g class="${classNameT}" filter="url(#tag_op_bg)" style="stroke-width:0;fill: #000000">
              <svg x="${(rectF.left - rectF.width()).toFixed(3)}%" y="${rectF.bottom.toFixed(3)}%" width="100%">
              <text class="${trashclassName}" dx="${operPadding}" dy="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;">X</text>
              <text dx="${operPadding / 2 + fontSize}" dy="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;" class="${imageOpTag}">${tagString}</text>
              </svg>
              </g>`
  collectionArr.push(dotTemplateT)
  return collectionArr;
}