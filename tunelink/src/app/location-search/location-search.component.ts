import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { IEvent } from 'src/event-data';
import { ILocation } from 'src/location-data';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
})
export class LocationSearchComponent implements OnInit {
  @ViewChild('place', { static: false }) place: ElementRef<HTMLInputElement> =
    {} as ElementRef;
  @ViewChild('events', { static: false }) events: ElementRef<HTMLDivElement> =
    {} as ElementRef;

  @Input() external: boolean = false; // Stops event display if a component other than location calls app-location-search
  @Output() header_display = new EventEmitter<boolean>(); // toggles "See upcoming events.." header
  @Output() locationEvent = new EventEmitter<IEvent[]>(); // returns list of events to component that called app-location-search
  @Output() clear_results = new EventEmitter<boolean>();   // emits to parent component to clear results

  private songkick_key: string = environment.songkickKey;
  private mapbox_key: string = environment.mapboxKey;
  private ticketmaster_key: string = environment.ticketmasterKey;

  public search_query: string = '';
  public location_results: ILocation[] = [];
  public metro_area_id: string = '';
  public event_list: IEvent[] = [];
  public artist_list: string[] = [];
  

  public location_status: boolean = false;
  public events_status: boolean = false;
  public no_location: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getLocations = async () => {
    if (this.place.nativeElement.value != '') {
      this.reset();
      this.search_query = encodeURIComponent(this.place.nativeElement.value);
      this.header_display.emit(false); // hide "See upcoming events.." header
      
      // Retrieve geocode for search query
      await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.search_query}.json?types=postcode,place,address,poi&fuzzyMatch=true&autocomplete=true&access_token=${this.mapbox_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          switch (data.features.length) {
            case 0:
              this.no_location = true;
              break;
            default:
              data.features.forEach((result: any) => {
                const newLocation: ILocation = {
                  name: result.place_name,
                  lat: result.center[1],
                  long: result.center[0],
                };
                this.location_results.push(newLocation);
              });
              this.location_status = true;
              break;
          }
        });
    }
  };

  getLocationEvents = async () => {
    // fetch call to retrieve corresponding metro area id from geocode
    // const segment = encodeURIComponent(JSON.stringify(['Music']));
    const segment = '[Music]'
    fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${this.ticketmaster_key}&keyword=${this.place.nativeElement.value}&size=100&segmentName=${segment}`
      )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data._embedded?.events.forEach((result: any) => {
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
        this.location_status = false;
        this.events_status = true;
        this.locationEvent.emit(this.event_list); // emit event_list to parent
      });
  };

  locationCalendars = async (id: string) => {
    return await fetch(
      `https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=${this.songkick_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        data.resultsPage.results.event.forEach((result: any) => {
          // Capture all artists performing at event
          this.artist_list = [];
          result.performance.forEach((artist: any) => {
            this.artist_list.push(artist.displayName);
          });

          // Construct event data
          const eventData: IEvent = {
            event_name: result.displayName,
            event_uri: result.uri,
            status: result.status,
            date: result.start.date,
            lat: result.location.lat,
            long: result.location.lng,
            city: result.location.city,
            state: 'hi',
            venue: result.venue.displayName,
            venue_uri: result.venue.uri,
            artists: this.artist_list,
          };
          this.event_list.push(eventData);
        });
        this.location_status = false;
        this.events_status = true;
        this.locationEvent.emit(this.event_list); // emit event_list to parent
      });
  };

  clear = () => {
    this.place.nativeElement.value = '';
    this.header_display.emit(true); // show "See upcoming events.." header
    this.clear_results.emit(true);  // have parent component clear results
    this.reset();
  };

  reset = () => {
    this.metro_area_id = '';
    this.artist_list = [];
    this.event_list = [];
    this.events_status = false;
    this.location_results = [];
    this.location_status = false;
    this.no_location = false;
  };
}
