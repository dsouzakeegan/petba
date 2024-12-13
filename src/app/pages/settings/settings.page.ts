import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';
interface infoData {
  description: string;
  information_id: string;
  language_id: string;
  meta_description: string;
  meta_keyword: string;
  meta_title: string;
  title: string;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  isModalOpen:boolean =false;
  Loading:boolean =true;
  infoData:infoData={
    description: "",
    information_id: "",
    language_id: "",
    meta_description: "",
    meta_keyword: "",
    meta_title: "",
    title: "",
  };
  support:{title:string,information_id:string}[]=[];
  constructor(
    private authService : AuthServiceService,
    private navCntrl: NavController,
    private alertCntrl : AlertServiceService,
    private loadingCtrl : LoadingScreenService,
  ) { }

  ngOnInit() {
    this.getSupportPage();
  }

  getSupportPage()
  {
    this.Loading=true;
    this.authService.postData({},'getsupport').then((res:any)=>{
      let supprt = res.data;
      if(supprt.length > 0 )
      {
        this.support = res.data;
        console.log(this.support);
      }else{
        console.error("Support pages empty")
      }
    }).catch((error)=>{console.error(error)}).finally(()=>{
      this.Loading =false;
    });
    
  }
  presentConfirmationAlert()
  {
    let  buttonOptions = [
     
      {
        text: 'Sign Out',
        cssClass:'button-color-danger button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
          this.logOut()
         
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass:'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
    ];
    this.alertCntrl.present("Sign Out",buttonOptions,"you will be logged out of Petba. Are you sure?","","custom-alert-1");
  }
 async logOut() {
    // throw new Error('Method not implemented.');
    const loader = await this.loadingCtrl.CreateLoader("Signing out...","circular",undefined,"loading-transparent-bg");
    await loader.present();

    setTimeout(async ()=>{
      localStorage.clear(); //clear user data 
    await  this.navCntrl.navigateRoot('login').finally(async ()=>{
        await loader.dismiss();
      });
    },3000); 

  }
 async setOpen(modalOpen:boolean,id?:string)
  {
    this.infoData={
    description: "",
    information_id: "",
    language_id: "",
    meta_description: "",
    meta_keyword: "",
    meta_title: "",
    title: "",
  }
  if(modalOpen)
    {
        // get data
        if(id) {
          const loader = await this.loadingCtrl.CreateLoader("","circular",undefined,"loading-transparent-bg");
          await loader.present();
          let params ={
            id:id
          }
          await this.authService.postData(params,'getsupportPage').then((res:any)=>{
            if(res.data != null)
            {
            this.infoData = res.data;
            }else{
              
              this.infoData = res.data;
            }
              }).catch((err)=>{
            console.error(err)
              }).finally(async()=>{
                await loader.dismiss();
        this.isModalOpen = true;
              })
        };
      }else{
        this.isModalOpen = false;
      }
  }
 async getInfo(spprtId:string)
  {
    let params ={
      id:spprtId
    }
    await this.authService.postData(params,'getsupportPage').then((res:any)=>{
      if(res.data != null)
      {
      this.infoData = res.data;
      }else{
        
        this.infoData = res.data;
      }
        }).catch((err)=>{
      console.error(err)
        })
  }
}
