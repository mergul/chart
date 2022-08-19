"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularBuffer = void 0;
/**
 * Circular buffers (also known as ring buffers) are fixed-size buffers that work as if the memory is contiguous & circular in nature.
 * As memory is generated and consumed, data does not need to be reshuffled – rather, the head/tail pointers are adjusted.
 * When data is added, the head pointer advances. When data is consumed, the tail pointer advances.
 * If you reach the end of the buffer, the pointers simply wrap around to the beginning.
 */
var CircularBuffer = /** @class */ (function () {
  var length, filled, pointer, buffer, maxIndex;
  /**
   * Constructor
   * @param length fixed buffer length
   */
  function CircularBuffer(length) {
    this.length = length;
    this.filled = false;
    this.pointer = 0;
    this.buffer = new Array(length);
    this.maxIndex = length - 1;
  }
  /**
   * Push item to buffer, when buffer length is overflow, push will rewrite oldest item
   */
  CircularBuffer.prototype.push = function (item) {
    var overwrited = this.buffer[this.pointer];
    this.buffer[this.pointer] = item;
    this.iteratorNext();
    return overwrited;
  };
  /**
   * Replace last added item in buffer (reversal push). May be used for revert push removed item.
   * @deprecated use peek instead
   */
  CircularBuffer.prototype.pushback = function (item) {
    this.iteratorPrev();
    var overwrited = this.buffer[this.pointer];
    this.buffer[this.pointer] = item;
    return overwrited;
  };
  /**
   * Get item for replacing, does not modify anything
   */
  CircularBuffer.prototype.peek = function () {
    return this.buffer[this.pointer];
  };
  /**
   * Array like forEach loop
   */
  CircularBuffer.prototype.forEach = function (callback) {
    var idx = this.pointer;
    var virtualIdx = 0;
    while (virtualIdx !== this.length) {
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx + 1) % this.length;
      virtualIdx++;
    }
  };
  /**
   * Array like forEach loop, but from last to first (reversal forEach)
   */
  CircularBuffer.prototype.forEachRight = function (callback) {
    var idx = (this.length + this.pointer - 1) % this.length;
    var virtualIdx = this.length - 1;
    while (virtualIdx !== this.length) {
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx - 1) % this.length;
      virtualIdx--;
    }
  };
  /**
   * Fill buffer
   */
  CircularBuffer.prototype.fill = function (item) {
    this.buffer.fill(item);
    this.filled = true;
  };
  /**
   * Get array from buffer
   */
  CircularBuffer.prototype.toArray = function () {
    return this.buffer;
  };
  /**
   * Move iterator to next position
   */
  CircularBuffer.prototype.iteratorNext = function () {
    this.pointer++;
    if (this.pointer > this.maxIndex) {
      this.pointer = 0;
      this.filled = true;
    }
  };
  /**
   * Move iterator to prev position
   */
  CircularBuffer.prototype.iteratorPrev = function () {
    this.pointer--;
    if (this.pointer < 0) {
      this.pointer = this.maxIndex;
    }
  };
  return CircularBuffer;
})();
exports.CircularBuffer = CircularBuffer;
