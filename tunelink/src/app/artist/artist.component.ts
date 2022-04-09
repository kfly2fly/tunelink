import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IArtist } from 'src/artist-data';
import { IEvent } from 'src/event-data';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  @ViewChild('artist', { static: false }) artist: ElementRef<HTMLInputElement> = {} as ElementRef;

  private songkick_key: string = "8NUFX7nR2KeXLUKt";
  public artist_match: IArtist[] = [];
  public event_list: IEvent[] = [];
  public artist_list: string[] = [];
  public artist_selection: boolean = false;     // selecting an artist
  public result_status: boolean = false;        // results to display
  public noResults: boolean = false;
  
  constructor() { 
  }

  ngOnInit(): void {
  }

  getArtistEvents = () => {
    this.reset();

    // Get songkick ID number of all matching artists
    fetch(`https://api.songkick.com/api/3.0/search/artists.json?apikey=${this.songkick_key}&query=${this.artist.nativeElement.value}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);        // TESTING
      (data.resultsPage.results.artist).forEach((result: any) => {
          // only returns artists who are performing
          if (result.onTourUntil != null) {
            const newArtist: IArtist = {
            artist_name: result.displayName,
            id: result.id,
            uri: result.uri
            }
            this.artist_match.push(newArtist);
          }
      });

    switch (this.artist_match.length) {
        case 0:
            // searched artist has no events
            this.noResults = true;
            break;
        case 1:
            // automatically display results if only one artist
            this.artist_selection = false;
            this.getArtist(this.artist_match[0].id);
            this.result_status = true;
            break;
        default:
            this.artist_selection = true;   // Allow the user to select a returned artist
            break;
    }
    });
  }

  getArtist = (artist_id: string) => {
    fetch(`https://api.songkick.com/api/3.0/artists/${artist_id}/calendar.json?apikey=${this.songkick_key}`)
    .then(response => response.json())
    .then(data => {
      (data.resultsPage.results.event).forEach((result: any) => {
        // Capture all artists performing at event
        this.artist_list = [];
        (result.performance).forEach((artist: any) => {
          this.artist_list.push(artist.displayName);
        });

        // Construct event data
        const eventData: IEvent = {
          event_name: result.displayName,
          status: result.status,
          date: result.start.date,
          lat: result.location.lat,
          long: result.location.lng,
          city: result.location.city,
          venue: result.venue.displayName,
          artists: this.artist_list
        };
        this.event_list.push(eventData);
      });
      this.artist_selection = false;
      this.result_status = true;
    });
  }

  reset = () => {
    this.artist_list = [];
    this.artist_match = [];
    this.event_list = [];
    this.artist_selection = false;
    this.result_status = false;
  }
}
