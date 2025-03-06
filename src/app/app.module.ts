import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { selectCityModule } from './components/city/select-city/select-city.module';
import { rescueCityModule } from './components/city/rescue-city/rescue-city.module';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { OfflineScreenModule } from './components/offline-screen/offline-screen.module';
import { NotificationService } from './services/notification.service';

const firebaseConfig = {
  apiKey: "AIzaSyANLkvq73CjqYy8O8YX0AoWA8i-XWH7Ho4",
  authDomain: "meencart-63510.firebaseapp.com",
  projectId: "meencart-63510",
  storageBucket: "meencart-63510.appspot.com",
  messagingSenderId: "991495485514",
  appId: "1:991495485514:web:1116393276b81b3b144eb3",
  measurementId: "G-J5VJPP35XY"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      backButtonDefaultHref: "/",
      innerHTMLTemplatesEnabled: true,
    }),
    selectCityModule,
    rescueCityModule,
    OfflineScreenModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NotificationService,
    // Firebase Initialization and Providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}