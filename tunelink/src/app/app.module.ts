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
<<<<<<< Updated upstream
=======
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
=======
    FooterComponent,
    ContactComponent,
>>>>>>> Stashed changes
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
