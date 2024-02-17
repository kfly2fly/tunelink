import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IArtist } from 'src/artist-data';
import { IEvent } from 'src/event-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {
  @ViewChild('artist', { static: false }) artist: ElementRef<HTMLInputElement> =
    {} as ElementRef;

  private songkick_key: string = environment.songkickKey;
  private ticketmaster_key: string = environment.ticketmasterKey;
  private ticketmaster_secret: string = environment.ticketmasterSecret;
  public artist_match: IArtist[] = [];
  public event_list: IEvent[] = [];
  public artist_list: string[] = [];

  public artist_selection: boolean = false; // selecting an artist
  public result_status: boolean = false; // results to display
  public noResults: boolean = false;
  public show_header: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  getArtist = () => {
    this.reset();
    console.log(this.artist.nativeElement.value);
    console.log(this.songkick_key)
    // Get songkick ID number of all matching artists
    fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${this.ticketmaster_key}&keyword=${this.artist.nativeElement.value}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // TESTING
        data._embedded.events.forEach((result: any) => {
          console.log(result);
          // only returns artists who are performing
          const concertDate = new Date(result.dates.start.localDate);
          if (concertDate.getTime() < new Date().getTime()) {
            return;
          }
          // Capture all artists performing at event
          this.artist_list = [];
          result._embedded?.attractions?.forEach((artist: any) => {
            this.artist_list.push(artist.name);
          });
          // Construct event data
          const eventData: IEvent = {
            event_name: result.name,
            event_uri: result.url,
            status: 'result.status,',
            date: result.dates?.start?.localDate,
            lat: 'result._embedded.venues[0].',
            long: 'result.location.lng',
            city: result._embedded?.venues[0]?.city?.name,
            state: result._embedded?.venues[0]?.state?.stateCode, 
            venue: result._embedded?.venues[0]?.name,
            venue_uri: result._embedded?.venues[0]?.url,
            artists: this.artist_list,
          };
          this.event_list.push(eventData);
        });
        console.log(this.event_list)
        this.artist_selection = false;
        this.result_status = true;
        this.show_header = false;
      });
  };

  clear = () => {
    this.artist.nativeElement.value = '';
    this.show_header = true;
    this.reset();
  };

  reset = () => {
    this.artist_list = [];
    this.artist_match = [];
    this.event_list = [];
    this.artist_selection = false;
    this.result_status = false;
  };
}
