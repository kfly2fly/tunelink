import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() artists: string[] = [];

  private ticketmaster_consumerkey: string = "bWZmR0G8KZUu7LsDQATWUhJUQ8MnPCN6";
  private ticketmaster_consumersecret: string = "2yjbTtCMztfAZsQN";

  constructor() { }

  ngOnInit(): void {
  }

  // eventsearch = async () => {
  //   return fetch(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=Madonna&apikey=${this.ticketmaster_consumerkey}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //   });
  // }  

}
