import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefresherCustomEvent } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
interface Notifications {
  title: string;
  seen: boolean;
  type: string;
  profileImg: string;
  message: string;
  time: string;
  id?: string;
  notification_id: string;
}

interface newNotifications {
  date: string,
  notifications: Notifications[]
}
interface result {
  body: string;
  customer_id: string;
  data: string;
  flag: string;
  id: string;
  img: string;
  notification_time: string;
  time: string;
  title: string;
  type: string;
}



@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  UserId: string;
  imgUrl: string;
  Loading: boolean = true;
  notifications: newNotifications[] = [

    //   {
    // title:'Event Watch',seen:true,messageType:'text',profileImg:"https://randomuser.me/api/portraits/men/14.jpg",message:"Join our notification list for the latest event buzz! Be the VIP with exclusive updates on upcoming events, special promotions, and behind-the-scenes sneak peeks. Don't miss a beat – subscribe now and make every moment count!",time:'today'
    //   },
    //   {
    // title:'Rescue Needed',seen:false,messageType:'text',profileImg:"https://randomuser.me/api/portraits/men/3.jpg",message:'need rescue team help. If the user didn t reply or request help, a help request SMS containing help request message and current location of mobile phone ',time:'yesterday'
    //   },
    //   {
    // title:'Saving one animal won’t change the world, but it will change the world for that one animal',seen:false,messageType:'text',profileImg:"https://randomuser.me/api/portraits/women/12.jpg",message:'So elegant soo beautiful just like a wow',time:'1 day ago'
    //   },
    //   {
    //     title:'Alerts & Updates',seen:false,messageType:'text',profileImg:"https://cdn4.sharechat.com/Cooldp_f3e94b7_1643720814990_sc_cmprsd_40.jpg?tenant=sc&referrer=post-rendering-service&f=rsd_40.jpg",message:'Stay in the loop! Subscribe to our notification list to receive timely alerts and updates. Be the first to know about exciting news, exclusive offers, and important announcements. Dont miss out – sign up now for a seamless flow of information!',time:'1 month ago'
    //       }
  ]

  wait: { type: string, notificaiton: Notifications[] }[] = [];
  constructor(
    private authService: AuthServiceService
    , private router: Router
    , private alertCntrl: AlertServiceService
    , private loadingCtrl: LoadingScreenService
  ) {
    this.UserId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
    this.imgUrl = this.authService.img3();
  }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications() {
    this.Loading = true;
    this.notifications=[];
    let param = {
      c_id: this.UserId
    }
    this.authService.postData(param, 'notificationList').then((res: any) => {
      let result: result[] = res.notificationList;
      if (result.length > 0) {
        // this.notifications = this.transFormData(result);
        this.notifications = this.NewtransFormData(result);
      }

    }).catch((error) => { console.error(error); }).finally(() => { this.Loading = false; })
  }

  // transFormData(result:result[]){
  //   let transformedData:Notifications[] = result.map((notif:result)=>
  //     ({
  //       title: notif.title
  //       ,seen: false
  //       ,type: notif.type
  //       ,profileImg: this.imgUrl+ notif.img
  //       ,message: notif.body
  //       ,time: notif.time
  //       ,id : notif.data
  //     }) 
  //   ) 
  //   return transformedData;
  // }

  goto(item: Notifications) {
    if (item?.type == 'rescue' && item?.id) {
      this.router.navigateByUrl(`/rescue/${item.id}`)
    } else if (item?.type == 'message' && item?.id) {
      console.error("Goto chat!! " + item.id);

    } else if (item?.type == 'orderUpdates') {
      this.router.navigateByUrl(`/my-orders`)

    }
    else if (item?.type == 'blog') {
      this.router.navigateByUrl(`/blog/${item.id}`)

    }
    else if (item?.type == 'rescue_comment') {
      this.router.navigateByUrl(`/rescue/${item.id}`)

    };
  }

  NewtransFormData(res: result[]) {
    let todayNotifications: Notifications[] = [];
    let yesterdayNotifications: Notifications[] = [];
    let thisWeekNotifications: Notifications[] = [];
    let thisMonthNotifications: Notifications[] = [];
    let olderNotifications: Notifications[] = [];
    res.forEach((notif: result) => {
      const notify = {
        title: notif.title
        , seen: false
        , type: notif.type
        , profileImg: this.imgUrl + notif.img //old 
        , message: notif.body
        , time: notif.time
        , id: notif.data
        , notification_id: notif.id
      }
      // Get today's date
      let today = new Date();

      // Iterate through notifications

      // Convert notif.time to a Date object
      let notifDate = new Date(notif.time);

      // Calculate the time difference in milliseconds
      let timeDiff = today.getTime() - notifDate.getTime();
      let dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      // Categorize notifications based on time
      if (dayDiff === 0) {
        todayNotifications.push(notify);
      } else if (dayDiff === 1) {
        yesterdayNotifications.push(notify);
      } else if (dayDiff <= 7) {
        thisWeekNotifications.push(notify);
      } else if (dayDiff <= 30) {
        thisMonthNotifications.push(notify);
      } else {
        olderNotifications.push(notify);
      }


      // return{title: notif.title
      // ,seen: false
      // ,type: notif.type
      // ,profileImg: this.imgUrl+ notif.img
      // ,message: notif.body
      // ,time: notif.time
      // ,id : notif.data}
    }
    )

    let transformedData: newNotifications[] = [
      {
        date: 'Today',
        notifications: todayNotifications
      },
      {
        date: 'Yesterday',
        notifications: yesterdayNotifications
      },
      {
        date: 'Last 7 days',
        notifications: thisWeekNotifications
      },
      {
        date: 'Last 30 days',
        notifications: thisMonthNotifications
      },
      {
        date: 'Older',
        notifications: olderNotifications
      }
    ]
    return transformedData;
  }
  clearAll_Prompt() {
    let buttonOptions = [

      {
        text: 'Clear all notifications',
        cssClass: 'button-color-danger button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
          //remove pet fuction  
          this.clearAll();
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
    ];
    this.alertCntrl.present("", buttonOptions, "<small>All notifications will be lost.<br/>Are you sure?</small>", "Clear Notifications", "custom-alert-1");

  }
  async clearAll() {
    const params = {
      c_id: this.UserId
    }
    const loader = await this.loadingCtrl.CreateLoader("", "circular", undefined, "loading-transparent-bg");
    await loader.present();
    await this.authService.postData(params, "clearNotification").then((result) => {
      this.notifications = [];
    }).catch((error) => { console.error(error) })
      .finally(async () => {
        await loader.dismiss();
      });
  }
  async removeNotification(notification_id:string) {
    let buttonOptions = [

      {
        text: 'Remove',
        cssClass: 'button-color-danger button-text-capitalize',
        role: 'confirm',
        handler: async() => {
         
          const params = {
            c_id: this.UserId,notification_id
          }
          const loader = await this.loadingCtrl.CreateLoader("", "circular", undefined, "loading-transparent-bg");
          await loader.present();
          await this.authService.postData(params, "deleteNotification").then((result) => {
            // this.notifications = this.notifications;
            this.getNotifications();
          }).catch((error) => { console.error(error) })
            .finally(async () => {
              await loader.dismiss();
            });
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
    ];
  await  this.alertCntrl.present("", buttonOptions, "<small>this notification will be removed.<br/>Are you sure?</small>", "Remove Notification", "custom-alert-1");
   
  }
  RefreshNotification(event: RefresherCustomEvent) {
    this.getNotifications();
    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
}
