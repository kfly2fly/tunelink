import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IEvent } from 'src/event-data';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  @ViewChild('city', { static: false }) city: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('country', { static: false }) country: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('events', { static: false }) events: ElementRef<HTMLDivElement> = {} as ElementRef;

  private songkick_key: string = "8NUFX7nR2KeXLUKt";
  public metro_area_id: string[] = [];
  public event_list: IEvent[] = [];
  public artist_list: string[] = [];
  public result_status: boolean = false;
  
// TODO:
// - Currently only returns results for the first match (multiple matches for 'London' in US but will only return first of three).  Have search return all.
// - Give user to include state parameter
// - Implement input error checking

  constructor() { 
  }

  ngOnInit(): void {
  }

  getLocationEvents = async () => {
    this.reset();

    if (this.country.nativeElement.value.toUpperCase() == "USA" 
    || this.country.nativeElement.value.toUpperCase() == "UNITED STATES"
    || this.country.nativeElement.value.toUpperCase() == "UNITED STATES OF AMERICA") {
      this.country.nativeElement.value = "US";
    }

    await fetch(`https://api.songkick.com/api/3.0/search/locations.json?query=${this.city.nativeElement.value}&apikey=${this.songkick_key}`)
    .then(response => response.json())
    .then(data => {
      // Match cities with country
      (data.resultsPage.results.location).forEach((match:any) => {
        if (match.city.country.displayName.toUpperCase() == this.country.nativeElement.value.toUpperCase()) {
          // this.metro_area_id = match.metroArea.id;
          this.metro_area_id.push(match.metroArea.id);
        }
      });
    });
    
    await this.locationCalendars(this.metro_area_id[0]);
  }

  locationCalendars = async (id : string) => {
    return await fetch(`https://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json?apikey=${this.songkick_key}`)
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
      this.result_status = true;
    });
  }

  reset = () => {
    this.metro_area_id = [];
    this.artist_list = [];
    this.event_list = [];
    this.result_status = false;
  }
}
