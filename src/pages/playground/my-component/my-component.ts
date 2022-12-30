import { autoinject, BindingEngine, inlineView } from "aurelia-framework";

@autoinject
@inlineView(`<template></template>`)
export class MyComponent {
  observeMe: string;
  subscription: any;

  constructor(private bindingEngine: BindingEngine) {
    this.bindingEngine = bindingEngine;
    this.observeMe = "myvalue";
  }

  attached() {
    this.subscription = this.bindingEngine
      .propertyObserver(this, "observeMe")
      .subscribe((newValue, oldValue) => {
        this.objectValueChanged(newValue, oldValue);
      });

    setInterval(() => {
      this.observeMe = "Cool date " + new Date();
    }, 2000);
  }

  detached() {
    this.subscription.dispose();
  }

  objectValueChanged(newValue, oldValue) {
    console.log(`observeMe value changed from: ${oldValue} to:${newValue}`);
  }
}
