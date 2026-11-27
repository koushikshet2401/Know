import { EventEmitter } from "events";

export default class MockPDFDocument extends EventEmitter {
  constructor(public options?: any) {
    super();
  }

  fontSize(_size: number) {
    return this;
  }

  font(_fontName: string) {
    return this;
  }

  fillColor(_color: string) {
    return this;
  }

  strokeColor(_color: string) {
    return this;
  }

  lineWidth(_width: number) {
    return this;
  }

  text(_text: string, _x?: any, _y?: any, _options?: any) {
    return this;
  }

  rect(_x: number, _y: number, _w: number, _h: number) {
    return this;
  }

  fill() {
    return this;
  }

  stroke() {
    return this;
  }

  moveTo(_x: number, _y: number) {
    return this;
  }

  lineTo(_x: number, _y: number) {
    return this;
  }

  end() {
    process.nextTick(() => {
      this.emit("data", Buffer.from("%PDF-1.4 Mock PDF Content for Test Suite"));
      this.emit("end");
    });
    return this;
  }
}
