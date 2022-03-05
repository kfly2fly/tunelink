import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private clientId: string = 'afbdab91d8214fbb979660933ccd05e1';
  private clientSecret: string = 'f3007731ce2742939c331ee1564ceb06';
  public token: string = '';

  constructor() { 
  }

  ngOnInit(): void {
    this.getToken();
  }

  // Generate access token for Spotify API requests
  getToken = () => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
      },
      body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
      this.token = data.access_token;
    })
  }

  // getPlaylistTracks = () => {
  //   (this.playlist_Id).forEach(playlist => {
  //     return fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
  //       method: 'GET', 
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${this.accessToken}`
  //       }
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log(data);
  //         (data.items).forEach((result: any) => {
  //           let artist = result.track.album.artists[0].name;
  //           if ((this.userArtist).indexOf(artist) === -1) {
  //               this.userArtist.push(artist);
  //           }
  //         })
  //         // console.log(this.userArtist);
  //       });
  //   })
  // }

  // getUserArtists = async () => {
  //   await this.getUserPlaylists();
  //   this.getPlaylistTracks();
    
  //   document.getElementById("artists")?.classList.toggle("hidden");
  // }
}
