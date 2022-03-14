import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { IProfile } from 'src/spotify-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('user_id', { static: false }) user_id: ElementRef<HTMLInputElement> = {} as ElementRef;

  private spotify_clientId: string = 'afbdab91d8214fbb979660933ccd05e1';
  private spotify_clientSecret: string = 'f3007731ce2742939c331ee1564ceb06';
  public spotify_token: string = '';

  userId: string = '';
  userName: string = '';
  userImage: string = '';
  userUrl: string = '';
  playlist_Id: string[] = [];
  userArtist: string[] = [];
  initialView = true;

  constructor() { }

  ngOnInit(): void {
    this.getToken();
  }

  // Generate access token for Spotify API requests
  getToken = () => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${this.spotify_clientId}:${this.spotify_clientSecret}`)
      },
      body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
      this.spotify_token = data.access_token;
    })
  }

  getProfile = (userId: string) => {
    if (this.userId != '' && this.initialView) {
      this.initialView = false;
      document.getElementById("profile")?.classList.toggle("hidden");
      document.getElementById("options")?.classList.toggle("hidden");
      document.getElementById("inputRow")?.classList.toggle("hidden");
      document.getElementById("inputHeader")?.classList.toggle("hidden");
    }
    this.user_id.nativeElement.value = '';

    fetch(`https://api.spotify.com/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.spotify_token}`
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

  // From user's profile, generates an array of playlist IDs
  getUserPlaylists = async (userId: string) => {
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.spotify_token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        (data.items).forEach((result: any) => {
          this.playlist_Id.push(result.id);
        })
      });
  }

  // Populates an array of artists the user listens to based on their playlists
  getPlaylistTracks = () => {
    (this.playlist_Id).forEach(playlist => {
      return fetch(`https://api.spotify.com/v1/playlists/${playlist}/tracks`, {
        method: 'GET', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.spotify_token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          (data.items).forEach((result: any) => {
            let artist = result.track.album.artists[0].name;
            if ((this.userArtist).indexOf(artist) === -1) {
                this.userArtist.push(artist);
            }
          })
          console.log(this.userArtist);

        });
    })
  }

  // Controller Function: oversees async execution of API fetch calls
  getUserDetails = async () => {
    this.userId = this.user_id.nativeElement.value;
    this.getProfile(this.userId);
    await this.getUserPlaylists(this.userId);
    await this.getPlaylistTracks();
  }
}
