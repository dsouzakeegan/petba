declare var navigator: any; // Add this at the top of your app.component.ts
import { Component, Optional, OnInit, NgZone } from '@angular/core';
import { IonRouterOutlet, MenuController, NavController, Platform, AlertController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { User } from './interfaces/User';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { App, RestoredListenerEvent, URLOpenListenerEvent } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ToastService } from './services/common/toast.service';
import { ChatService } from './services/chat/chat.service';
import { Router } from '@angular/router';

const restoreSateKey = 'restoreState';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'My Donations', url: '/my-donations', icon: 'cash' },
    { title: 'My Orders', url: '/my-orders', icon: 'receipt' },
    { title: 'Shop By Categroy', url: '/shop-by-category', icon: 'laptop' },
    { title: 'Rescues', url: '/rescues', icon: 'fitness' },
    { title: 'Add Rescue Pet', url: '/rescuepet', icon: 'person-add' },
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'WishList', url: '/product-wishlist', icon: 'heart' },
    { title: 'My Pets', url: '/my-pets', icon: 'paw' },
    { title: 'Services', url: '/all-services', icon: 'extension-puzzle' },
    { title: 'Blogs', url: '/blogs', icon: 'copy' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  User: User | null = null;

  constructor(
    public menuCntrl: MenuController,
    private platform: Platform,
    private navCtrl: NavController,
    private zone: NgZone,
    private nav: NavController,
    private toastCtrl: ToastService,
    private chatService: ChatService,
    private alertController: AlertController, // Add AlertController for exit confirmation
    private router: Router, // Add the router to check the current route
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    if (this.platform.is('hybrid')) {
      this.styleStatusBar();
    }
    this.platform
      .ready()
      .then((resp) => {
        console.log('Platform ready :', resp);
        this.initializePhase1();
        this.initializePhase2();
        this.initializeBackButtonCustomHandler(); // Initialize back button handler
      })
      .catch((error) => {
        console.error(error);
      });

    defineCustomElements(window);
  }

  ngOnInit() {
    this.chatService.onNotification().subscribe(notification => {
      if (notification) {
        // this.presentToast(notification);
      }
    });
  }

  async disableMenu() {
    console.log('disable menu...');
    return await this.menuCntrl.enable(false, 'petba-main-menu');
  }

  checkLoggedIn(): boolean {
    console.log('checking user Login...');
    let IsLoggedIn = localStorage.getItem('userData');
    return IsLoggedIn != null ? true : false;
  }

  initializePhase1() {
    console.log('Initializing phase 1...');

    if (this.checkLoggedIn()) {
      console.log('User is already logged in....');
    } else {
      console.error('Login Needed !');
      this.navCtrl.navigateRoot('/login');
      this.disableMenu()
        .then((resp) => {
          console.log('Menu Disabled');
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => {});
    }
  }

  initializePhase2() {
    console.log('Initializing phase 2...');
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const domain = 'petba.in';
        const pathArray = event.url.split(domain);

        const appPath = pathArray.pop();
        if (this.checkLoggedIn()) {
          if (appPath) {
            this.nav.navigateForward(appPath);
          }
        } else {
          this.navCtrl.navigateRoot('/login');
        }
      });
    });

    App.addListener('appRestoredResult', (event: RestoredListenerEvent) => {
      this.zone.run(() => {
        if (event.success === true) {
          const restorePoint = localStorage.getItem(restoreSateKey);
          if (restorePoint) {
            const url = JSON.parse(restorePoint).path;
            if (url == '/profile')
              this.nav.navigateForward(url).finally(() => {
                localStorage.removeItem(restoreSateKey);
              });
          }
        }
      });
    });
  }

  // Custom handler for the hardware back button
  initializeBackButtonCustomHandler() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url; // Get the current active URL

      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        // If the router can go back (not the home page), go back
        this.routerOutlet.pop();
      } else if (currentUrl === '/home') {
        // If it's the home page, directly exit the app
        if (this.platform.is('hybrid')) {
          App.exitApp(); // Exit for Capacitor apps
        } else if (this.platform.is('cordova')) {
          navigator['app'].exitApp(); // Exit for Cordova apps
        }
      } else {
        // Default back button behavior for other pages
        window.history.back();
      }
    });
  }

  styleStatusBar() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this._setStatusBarDark();
    } else {
      this._setStatusBarLight();
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (event.matches) {
          this._setStatusBarDark();
        } else {
          this._setStatusBarLight();
        }
      });
  }

  _setStatusBarDark() {
    let color = '#1f1f1f';
    this.setStatusBarBackgroundColor(color);
    this.setStatusBarStyleDark();
  }

  _setStatusBarLight() {
    let color = '#ffffff';
    this.setStatusBarBackgroundColor(color);
    this.setStatusBarStyleLight();
  }

  setStatusBarStyleDark = async () => {
    if (this.platform.is('hybrid')) {
      await StatusBar.setStyle({ style: Style.Dark });
    }
  };

  setStatusBarStyleLight = async () => {
    if (this.platform.is('hybrid')) {
      await StatusBar.setStyle({ style: Style.Light });
    }
  };

  setStatusBarBackgroundColor = async (color: string) => {
    if (this.platform.is('hybrid')) {
      StatusBar.setBackgroundColor({ color });
    }
  };
}
