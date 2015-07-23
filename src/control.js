import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ApiClient} from './backend/api-client';

@inject(ApiClient, Router)
export class Control {
  heading = "Now Playing";
  betweenSongs = true;

  currentSong = null;

  constructor(api, router){
    this.api = api;
    this.router = router;
  }

  showSearch() {
    this.router.navigate('songs');
  }

  refresh() {
    this.api.getCurrent().then(response => {
      this.currentSong = response.content;
    }, err => {

      if (err.statusCode != 404) {
        var errorText = err.statusText || "Unknown error";

        //this.logger.error("Failed to get Now Playing: " + errorText);
      }

      this.currentSong = null;
    });

    return this.api.getQueue().then(response => {
      this.queue = response.content;
    }, err => {
      var errorText = err.statusText || "Unknown error";

      //this.logger.error("Failed to get queue: " + errorText);
    });
  }

  restart() {
    if (confirm("Restart from beginning?")) {
      return this.api.restart().then(() => {
        this.refresh();
      });
    }
  }

  skip() {
    if (confirm("Skip current song?")) {
      return this.api.skip().then(() => {
        this.refresh();
      });
    }
  }

}
