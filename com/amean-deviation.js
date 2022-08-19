"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeanDeviationProvider = void 0;
var circular_buffer_1 = require("./circular-buffer");
var MeanDeviationProvider = /** @class */ (function () {
  var period, values;
  function MeanDeviationProvider(period) {
    this.period = period;
    this.values = new circular_buffer_1.CircularBuffer(period);
  }
  MeanDeviationProvider.prototype.nextValue = function (typicalPrice, average) {
    if (!average) {
      this.values.push(typicalPrice);
      return void 0;
    }
    this.nextValue = this.pureNextValue;
    this.momentValue = this.pureMomentValue;
    return this.pureNextValue(typicalPrice, average);
  };
  MeanDeviationProvider.prototype.momentValue = function (
    typicalPrice,
    average
  ) {
    return void 0;
  };
  MeanDeviationProvider.prototype.pureNextValue = function (
    typicalPrice,
    average
  ) {
    var _this = this;
    this.values.push(typicalPrice);
    return (
      this.values.toArray().reduce(function (acc, value) {
        return acc + _this.positiveDelta(average, value);
      }, 0) / this.period
    );
  };
  MeanDeviationProvider.prototype.pureMomentValue = function (
    typicalPrice,
    average
  ) {
    var _this = this;
    var rm = this.values.push(typicalPrice);
    var mean = this.values.toArray().reduce(function (acc, value) {
      return acc + _this.positiveDelta(average, value);
    }, 0);
    this.values.pushback(rm);
    return mean / this.period;
  };
  MeanDeviationProvider.prototype.positiveDelta = function (a, b) {
    return a > b ? a - b : b - a;
  };
  return MeanDeviationProvider;
})();
exports.MeanDeviationProvider = MeanDeviationProvider;
