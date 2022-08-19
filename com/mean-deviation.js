import { CircularBuffer } from "./circular-buffer";
export default class MeanDeviationProvider {
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
