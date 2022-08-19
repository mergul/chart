"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCI = void 0;
var sma_1 = require("./simplema");
var mean_deviation_1 = require("./mean-deviation");
/**
 * The CCI, or Commodity Channel Index, was developed by Donald Lambert,
 * a technical analyst who originally published the indicator in Commodities magazine (now Futures)
 * in 1980.1 Despite its name, the CCI can be used in any market and is not just for commodities
 */

var CCI = /** @class */ (function () {
  var md, sma;
  function CCI(period) {
    if (period === void 0) {
      period = 20;
    }
    this.md = new mean_deviation_1.MeanDeviationProvider(period);
    this.sma = new sma_1.SMA(period);
  }
  CCI.prototype.nextValue = function (high, low, close) {
    var typicalPrice = (high + low + close) / 3;
    var average = this.sma.nextValue(typicalPrice);
    var meanDeviation = this.md.nextValue(typicalPrice, average);
    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  };
  CCI.prototype.momentValue = function (high, low, close) {
    var typicalPrice = (high + low + close) / 3;
    var average = this.sma.momentValue(typicalPrice);
    var meanDeviation = this.md.momentValue(typicalPrice, average);
    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  };
  return CCI;
})();
exports.CCI = CCI;
