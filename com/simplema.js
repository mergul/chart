"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMA = void 0;
var circular_buffer_1 = require("./circular-buffer");
// console.log(sma([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));
//=> [ '2.50', '3.50', '4.50', '5.50', '6.50', '7.50' ]
//=>   │       │       │       │       │       └─(6+7+8+9)/4
//=>   │       │       │       │       └─(5+6+7+8)/4
//=>   │       │       │       └─(4+5+6+7)/4
//=>   │       │       └─(3+4+5+6)/4
//=>   │       └─(2+3+4+5)/4
//=>   └─(1+2+3+4)/4
var SMA = /** @class */ (function () {
  var period, sum, circular;
  function SMA(period) {
    this.period = period;
    this.sum = 0;
    this.circular = new circular_buffer_1.CircularBuffer(period);
  }
  SMA.prototype.nextValue = function (value) {
    var _this = this;
    this.circular.push(value);
    this.sum += value;
    if (!this.circular.filled) {
      return;
    }
    this.nextValue = function (value) {
      _this.sum = _this.sum - _this.circular.push(value) + value;
      return _this.sum / _this.period;
    };
    this.momentValue = function (value) {
      return (_this.sum - _this.circular.peek() + value) / _this.period;
    };
    return this.sum / this.period;
  };
  SMA.prototype.momentValue = function (value) {
    return;
  };
  return SMA;
})();
exports.SMA = SMA;
