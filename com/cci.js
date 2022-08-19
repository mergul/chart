// import SMA from "./sama";
// import MeanDeviationProvider from "./mean-deviation";

/**
 * The CCI, or Commodity Channel Index, was developed by Donald Lambert,
 * a technical analyst who originally published the indicator in Commodities magazine (now Futures)
 * in 1980.1 Despite its name, the CCI can be used in any market and is not just for commodities
 */
export default class CCI {
  constructor(period = 20) {
    this.md = new MeanDeviationProvider(period);
    this.sma = new SMA(period);
  }

  nextValue(high, low, close) {
    const typicalPrice = (high + low + close) / 3;
    const average = this.sma.nextValue(typicalPrice);
    const meanDeviation = this.md.nextValue(typicalPrice, average);

    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  }

  momentValue(high, low, close) {
    const typicalPrice = (high + low + close) / 3;
    const average = this.sma.momentValue(typicalPrice);
    const meanDeviation = this.md.momentValue(typicalPrice, average);

    return meanDeviation && (typicalPrice - average) / (0.015 * meanDeviation);
  }
}
export class CircularBuffer {
  /**
   * Constructor
   * @param length fixed buffer length
   */
  constructor(length) {
    this.buffer = new Array(length);
    this.maxIndex = length - 1;
    this.pointer = 0;
    this.filled = false;
  }

  /**
   * Push item to buffer, when buffer length is overflow, push will rewrite oldest item
   */
  push(item) {
    const overwrited = this.buffer[this.pointer];

    this.buffer[this.pointer] = item;
    this.iteratorNext();

    return overwrited;
  }

  /**
   * Replace last added item in buffer (reversal push). May be used for revert push removed item.
   * @deprecated use peek instead
   */
  pushback(item) {
    this.iteratorPrev();
    const overwrited = this.buffer[this.pointer];
    this.buffer[this.pointer] = item;

    return overwrited;
  }

  /**
   * Get item for replacing, does not modify anything
   */
  peek() {
    return this.buffer[this.pointer];
  }

  /**
   * Array like forEach loop
   */
  forEach(callback) {
    let idx = this.pointer;
    let virtualIdx = 0;

    while (virtualIdx !== this.length) {
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx + 1) % this.length;
      virtualIdx++;
    }
  }

  /**
   * Array like forEach loop, but from last to first (reversal forEach)
   */
  forEachRight(callback) {
    let idx = (this.length + this.pointer - 1) % this.length;
    let virtualIdx = this.length - 1;

    while (virtualIdx !== this.length) {
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx - 1) % this.length;
      virtualIdx--;
    }
  }

  /**
   * Fill buffer
   */
  fill(item) {
    this.buffer.fill(item);
    this.filled = true;
  }

  /**
   * Get array from buffer
   */
  toArray() {
    return this.buffer;
  }

  /**
   * Move iterator to next position
   */
  iteratorNext() {
    this.pointer++;

    if (this.pointer > this.maxIndex) {
      this.pointer = 0;
      this.filled = true;
    }
  }

  /**
   * Move iterator to prev position
   */
  iteratorPrev() {
    this.pointer--;

    if (this.pointer < 0) {
      this.pointer = this.maxIndex;
    }
  }
}
export class MeanDeviationProvider {
  constructor(period) {
    this.values = new CircularBuffer(period);
  }

  nextValue(typicalPrice, average) {
    if (!average) {
      this.values.push(typicalPrice);
      return void 0;
    }

    this.nextValue = this.pureNextValue;
    this.momentValue = this.pureMomentValue;

    return this.pureNextValue(typicalPrice, average);
  }

  momentValue(typicalPrice, average) {
    return void 0;
  }

  pureNextValue(typicalPrice, average) {
    this.values.push(typicalPrice);

    return (
      this.values
        .toArray()
        .reduce((acc, value) => acc + this.positiveDelta(average, value), 0) /
      this.period
    );
  }

  pureMomentValue(typicalPrice, average) {
    const rm = this.values.push(typicalPrice);
    const mean = this.values
      .toArray()
      .reduce((acc, value) => acc + this.positiveDelta(average, value), 0);

    this.values.pushback(rm);

    return mean / this.period;
  }

  positiveDelta(a, b) {
    return a > b ? a - b : b - a;
  }
}
export class SMA {
  constructor(period) {
    this.circular = new CircularBuffer(period);
    this.sum = 0;
  }

  nextValue(value) {
    this.circular.push(value);
    this.sum += value;

    if (!this.circular.filled) {
      return;
    }

    this.nextValue = (value) => {
      this.sum = this.sum - this.circular.push(value) + value;

      return this.sum / this.period;
    };

    this.momentValue = (value) => {
      return (this.sum - this.circular.peek() + value) / this.period;
    };

    return this.sum / this.period;
  }

  momentValue(value) {
    return;
  }
}
