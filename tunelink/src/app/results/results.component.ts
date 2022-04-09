import { Component, OnInit, Input} from '@angular/core';
import { IArtist } from 'src/artist-data';
import { IEvent } from 'src/event-data';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() userArtist: string[] = [];
  @Input() artist_list: IArtist[] = [];
  @Input() event_list: IEvent[] = [];

  private ticketmaster_consumerkey: string = "bWZmR0G8KZUu7LsDQATWUhJUQ8MnPCN6";
  private ticketmaster_consumersecret: string = "2yjbTtCMztfAZsQN";
  
  constructor() { }

  ngOnInit(): void {
    if (this.artist_list.length > 0) {
      this.displayArtists();
    }
    else if (this.event_list.length > 0) {
      this.displayEvents();
    }
  }

  displayArtists = () => {
    console.log("artists");
  }

  displayEvents = () => {
    console.log("events");
  }

}
