import {bindable, computedFrom, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ApiClient} from 'backend/api-client';

@inject(ApiClient, Router)
export class Player{

  color = "#000000";

  colors = [
    { hex: "#4B0082", name: "Plum" },
    { hex: "#008000", name: "Lime" },
    { hex: "#191970", name: "Blueberry" },
    { hex: "#800000", name: "Cherry" },
    { hex: "#222222", name: "Licorice" },
    { hex: "#808000", name: "Olive" },
    { hex: "#BA55D3", name: "Bubblegum" }
  ];

  @computedFrom('color')
  get colorPreview() {
    return `background-color: ${this.color}`;
  }

  @computedFrom('color', 'name')
  get isInvalid() {
    return !this.color || !this.name;
  }

  constructor(api, router){
    this.api = api;
    this.router = router;

    this.reset();
  }

  save() {
    this.api.playerName = this.name;
    this.api.playerColor = this.color;
    this.api.persistSettings();

    this.router.navigate('');
  }

  reset() {
    var rndColor = Math.floor(Math.random() * (this.colors.length));

    this.name = this.api.playerName;
    this.color = this.api.playerColor || this.colors[rndColor].hex;
    this.unknownPlayer = !this.api.playerName || !this.api.playerColor;
  }
}
