import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

export class ApiClient {

  get canEnqueue() {
    return this.playerName && this.playerColor ? true : false;
  }

  constructor() {
    this.playerName = localStorage.getItem("kara-player-name") || "";
    this.playerColor = localStorage.getItem("kara-player-color") || "";
    this.http = new HttpClient()
      .configure(x => {
        x.withBaseUrl("/v1");
      });
  }

  rawGet(rawUrl) {
    return this.http.createRequest(rawUrl).asGet().withBaseUrl("").send();
  }

  searchSongs(category, query) {

    category = encodeURIComponent(category || '');
    query = encodeURIComponent(query || '');

    return this.http.get(`songs?category=${category}&search=${query}&take=10`);
  }

  getCategories() {
    return this.http.get("songs/categories");
  }

  getCurrent() {
    return this.http.get("playback/current");
  }

  getQueue() {
    return this.http.get("queue");
  }

  enqueue(id, isSecret) {
    return this.http.createRequest("queue").asPost().withContent({
      Secret: isSecret,
      SongId: id,
      Player: {
        Name: this.playerName,
        HexColor: this.playerColor
      }
    }).withHeader("Content-Type", "application/json").send()
  }

  restart() {
    return this.http.createRequest("playback/restart").asPost().withContent({}).withHeader("Content-Type", "application/json").send();
  }

  skip() {
    return this.http.createRequest("playback/skip").asPost().withContent({}).withHeader("Content-Type", "application/json").send();
  }

  persistSettings() {
    localStorage.setItem("kara-player-name", this.playerName);
    localStorage.setItem("kara-player-color", this.playerColor);
  }
}
