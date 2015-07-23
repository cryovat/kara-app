import {computedFrom, bindable, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

import {ApiClient} from 'backend/api-client';

import linkParser from 'parse-link-header';

@inject(ApiClient, Router)
export class Songs{
  heading = 'Songs';
  @bindable selectedCategory = '';
  categories = [];

  @bindable searchText = '';
  searchResults = [];
  secretSong = false;
  baseUrl = 'songs';

  startUrl = "";
  prevUrl = "";
  nextUrl = "";

  @computedFrom('prevUrl')
  get hasPrevious() {
    return this.prevUrl.length > 0;
  }

  @computedFrom('nextUrl')
  get hasNext() {
    return this.nextUrl.length > 0 ;
  }

  constructor(api, router){
    this.api = api;
    this.router = router;
  }

  clearSearch() {
    this.searchText = '';
  }

  activate(){
    return this.api.getCategories().then(response => {

      this.categories = response.content;

      return this.searchSongs();
    });
  }

  previousPage() {
    if (this.prevUrl.length) {
      this.searchSongs(this.prevUrl);
    }
  }

  nextPage() {
    if (this.nextUrl.length) {
      this.searchSongs(this.nextUrl);
    }
  }

  enqueue(id) {

    if (this.api.canEnqueue === true) {
      return this.api.enqueue(id, this.secretSong).then(response => {
        this.router.navigate('');
      });
    }

    if (confirm("You haven't told us who you are! Edit profile?")) {
      this.router.navigate('player');
    }

  }

  searchSongs(link) {
    var rq = link ? this.api.rawGet(link)
                  : this.api.searchSongs(this.selectedCategory, this.searchText);

    return rq.then(response => {

      console.log(response);

      var links = linkParser(response.headers.headers["Link"]);

      this.startUrl = links && links.start ? links.start.url : "";
      this.nextUrl = links && links.next ? links.next.url : "";
      this.prevUrl = links && links.previous ? links.previous.url : "";

      this.searchResults = response.content;
    });
  }

  selectedCategoryChanged(newValue, oldValue) {
    return this.searchSongs(null);
  }

  searchTextChanged(newValue, oldValue) {
    return this.searchSongs(null);
  }
}
