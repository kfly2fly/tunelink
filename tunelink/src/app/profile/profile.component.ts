import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { IProfile } from 'src/spotify-profile';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('user_id', { static: false }) user_id: ElementRef<HTMLInputElement> = {} as ElementRef;
  @Input() accessToken: string = '';

  userId: string = '';
  userName: string = '';
  userImage: string = '';
  userUrl: string = '';
  playlist_Id: string[] = [];
  userArtist: string[] = [];
  initialView = true;

  constructor() { }

  ngOnInit(): void {
  }

  getUserProfile = () => {
    this.userId = this.user_id.nativeElement.value;
    if (this.userId != '' && this.initialView) {
      this.initialView = false;
      document.getElementById("profile")?.classList.toggle("hidden");
      document.getElementById("options")?.classList.toggle("hidden");
      document.getElementById("inputHeader")?.classList.toggle("hidden");
      document.getElementById("inputRow")?.classList.toggle("hidden");
    }  
    this.userArtist = [];
    this.user_id.nativeElement.value = '';

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

  // From user's profile, generates an array of playlist IDs
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

}
