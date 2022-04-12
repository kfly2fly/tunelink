import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
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

  private songkick_key: string = '8NUFX7nR2KeXLUKt';
  private mapbox_key: string =
    'pk.eyJ1Ijoid2luaXZpcyIsImEiOiJja3p6MWdhc20wNXNhM2pzMDd2b3B5bHczIn0.HZ585lasEzRwmZVPWK2aAg';
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

  getLocationEvents = (location: ILocation) => {
    // fetch call to retrieve corresponding metro area id from geocode
    fetch(
      `https://api.songkick.com/api/3.0/search/locations.json?location=geo:${location.lat},${location.long}&apikey=${this.songkick_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        // first result of array is closest to geocoordinates
        this.metro_area_id = data.resultsPage.results.location[0].metroArea.id;
        this.locationCalendars(this.metro_area_id);
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
