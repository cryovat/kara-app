import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';

import {ApiClient} from 'backend/api-client';

@inject(ApiClient)
export class App {

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router){
    config.title = 'KRemote';
    config.addPipelineStep('authorize', RequireNameStep);
    config.map([
      { route: ['','control'], name: 'control',      moduleId: './control',      nav: true, title:'Now Playing',    auth: true },
      { route: 'songs',        name: 'songs',        moduleId: './songs',        nav: true, title:'Songs',          auth: true },
      { route: 'player',       name: 'player',       moduleId: './player',       nav: true, title:'Player' }
    ]);

    this.router = router;
  }
}

@inject(ApiClient)
class RequireNameStep {
  constructor(api) {
    this.api = api;
  }

  run(routingContext, next) {

    if (routingContext.nextInstructions.some(i => i.config.auth)) {
      if (this.api.canEnqueue !== true) {
        return next.cancel(new Redirect('player'));
      }
    }

    return next();
  }
}
