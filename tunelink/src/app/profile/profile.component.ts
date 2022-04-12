import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProfile } from 'src/spotify-profile';
import { IEvent } from 'src/event-data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('user_id', { static: false })
  user_id: ElementRef<HTMLInputElement> = {} as ElementRef;

  private spotify_clientId: string = 'afbdab91d8214fbb979660933ccd05e1';
  private spotify_clientSecret: string = 'f3007731ce2742939c331ee1564ceb06';
  public spotify_token: string = '';

  public userId: string = '';
  public userName: string = '';
  public userImage: string = '';
  public userUrl: string = '';
  public playlist_Id: string[] = [];
  public userArtist: string[] = [];
  public events_list: IEvent[] = [];
  public matched_artistToLocation: IEvent[] = [];

  public show_search: boolean = true;
  public show_user: boolean = false;
  public show_events: boolean = false;
  public external: boolean = true;
  public no_events: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.getToken();
  }

  // Generate access token for Spotify API requests
  getToken = () => {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          btoa(`${this.spotify_clientId}:${this.spotify_clientSecret}`),
      },
      body: 'grant_type=client_credentials',
    })
      .then((response) => response.json())
      .then((data) => {
        this.spotify_token = data.access_token;
      });
  };

  getProfile = (userId: string) => {
    if (this.userId.length < 1) {
      console.log('USER ID WAS NOT ENTERED');
    } else {
      this.user_id.nativeElement.value = '';

      fetch(`https://api.spotify.com/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.spotify_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const userProfile: IProfile = {
            display_name: data.display_name,
            image:
              data.images.length > 0
                ? data.images[0].url
                : '../../assets/spotify_logo.png',
            spot_url: data.external_urls.spotify,
          };

          this.userName = userProfile.display_name;
          this.userImage = userProfile.image;
          this.userUrl = userProfile.spot_url;
          this.show_search = false;
          this.show_user = true;
        });
    }
  };

  // From user's profile, generate an array of playlist IDs
  getUserPlaylists = async (userId: string) => {
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.spotify_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.items.forEach((result: any) => {
          this.playlist_Id.push(result.id);
        });
      });
  };

  // Populates an array of artists the user listens to based on their playlists
  getPlaylistTracks = () => {
    this.playlist_Id.forEach(async (playlist) => {
      return await fetch(
        `https://api.spotify.com/v1/playlists/${playlist}/tracks`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.spotify_token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          data.items.forEach((result: any) => {
            let artist = result.track.album.artists[0].name;
            if (!this.userArtist.includes(artist)) {
              // only add new artists to list
              this.userArtist.push(artist);
            }
          });
          console.log(this.userArtist);
        });
    });
  };

  // Controller Function: oversees async execution of API fetch calls
  getUserDetails = async () => {
    this.userId = this.user_id.nativeElement.value;
    this.getProfile(this.userId);
    await this.getUserPlaylists(this.userId);
    this.getPlaylistTracks();
  };

  compareArtistLocation = ($event: any) => {
    // copy $event to a local array so we can splice pushed events
    this.events_list = JSON.parse(JSON.stringify($event));

    // compare events_list for matches against userArtist
    this.userArtist.forEach((artist: string) => {
      this.events_list.forEach((event: IEvent, index: number) => {
        if (event.artists.includes(artist)) {
          this.matched_artistToLocation.push(event);
          this.events_list.splice(index, 1);
        }
      });
    });

    if (this.matched_artistToLocation.length >= 1) {
      // match found, display results
      this.show_events = true;
    } else if (this.matched_artistToLocation.length == 0) {
        this.no_events = true;
    } else {
      console.log('ERROR: invalid array length');
    }
  };

  clear = ($event: any) => {
    // this.reset();
    this.matched_artistToLocation = [];
    this.show_events = false;
    this.no_events = false;
  }

  reset = () => {
    this.userId = '';
    this.userName = '';
    this.userImage = '';
    this.userUrl = '';
    this.playlist_Id = [];
    this.userArtist = [];
    this.show_search = true;
    this.show_user = false;
    this.show_events = false;
    this.no_events = false;
  };
}
