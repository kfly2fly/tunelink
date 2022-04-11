import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  public external: boolean = false;
  public show_header: boolean = true;

  constructor() {}

  ngOnInit(): void {}

    toggle_header = ($event: any) => {
        this.show_header = $event;
    }
}
