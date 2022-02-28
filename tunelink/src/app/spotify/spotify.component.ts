import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProfile } from 'src/spotify-profile';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {
  @ViewChild('user_id', { static: false }) user_id: ElementRef<HTMLInputElement> = {} as ElementRef;

  private clientId: string = 'afbdab91d8214fbb979660933ccd05e1';
  private clientSecret: string = 'f3007731ce2742939c331ee1564ceb06';
  private accessToken: string = '';
  userId: string = '';
  userName: string = '';
  userImage: string = '';
  userUrl: string = '';
  playlist_Id: string[] = [];
  userArtist: string[] = [];
  initialView = true;

  constructor() { 
  }

  ngOnInit(): void {
    this.getToken();
  }

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
      this.accessToken = data.access_token;
    })
  }

  getUserProfile = () => {
    this.userId = this.user_id.nativeElement.value;
    if (this.userId != '' && this.initialView) {
      this.initialView = false;
      document.getElementById("profile")?.classList.toggle("hidden");
      document.getElementById("options")?.classList.toggle("hidden");
    }  
    this.userArtist = [];

    fetch(`https://api.spotify.com/v1/users/${this.userId}`, {
      method: 'GET', 
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const userProfile: IProfile = {
          display_name: data.display_name,
          image: data.images.length > 0 ? data.images[0].url : '../../assets/spotify_logo.png',
          spot_url: data.external_urls.spotify
        }

        this.userName = userProfile.display_name;
        this.userImage = userProfile.image;
        this.userUrl = userProfile.spot_url;
      }); 
  }

  getUserPlaylists = () => {
    this.userId = this.user_id.nativeElement.value;
    return fetch(`https://api.spotify.com/v1/users/${this.userId}/playlists`, {
      method: 'GET', 
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        (data.items).forEach((result: any) => {
            this.playlist_Id.push(result.id);
        })
      });
  }

  getPlaylistTracks = () => {
    (this.playlist_Id).forEach(playlist => {
      return fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          (data.items).forEach((result: any) => {
            let artist = result.track.album.artists[0].name;
            if ((this.userArtist).indexOf(artist) === -1) {
                this.userArtist.push(artist);
            }
          })
          // console.log(this.userArtist);
        });
    })
  }

  getUserArtists = async () => {
    await this.getUserPlaylists();
    this.getPlaylistTracks();
    
    document.getElementById("artists")?.classList.toggle("hidden");
  }
}
