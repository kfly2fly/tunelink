import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ResultsComponent } from './results/results.component';
import { LocationComponent } from './location/location.component';
import { ArtistComponent } from './artist/artist.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ProfileComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    NotfoundComponent,
    ResultsComponent,
    LocationComponent,
    ArtistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
