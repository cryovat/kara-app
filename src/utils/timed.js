import {inject, bindable} from 'aurelia-framework';

export class TimedCustomAttribute {
  @bindable interval;
  @bindable callback;

  timeoutId = 0;

  attached() {
    if (this.callback) {
      this.callback();
    }

    this.scheduleTick();
  }

  detached() {
    this.clearTick();
  }

  callbackValueChanged(newValue) {
    this.scheduleTick();
  }

  intervalValueChanged(newValue) {
    this.scheduleTick();
  }

  scheduleTick() {
    this.clearTick();

    var interval = this.interval,
        callback = this.callback;

    if (interval && callback) {
      window.setTimeout(() => { callback(); this.scheduleTick(); }, interval);
    }
  }

  clearTick() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = 0;
    }
  }
}
