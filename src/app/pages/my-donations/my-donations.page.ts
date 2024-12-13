import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface Donations {
  amount: string;
  date_time: string;
  donation_id: string;
  img1: string;
  name: string;
}



@Component({
  selector: 'app-my-donations',
  templateUrl: './my-donations.page.html',
  styleUrls: ['./my-donations.page.scss','../notifications/notifications.page.scss'],
})
export class MyDonationsPage implements OnInit {
  Loading:boolean=true;
  imgUrl:string;
  ImgError='../../../../assets/error/service-fallback.jpg';
  User:User;
  PARAM=
    {
      c_id :"",offset:0
    }
  a = 
  {
 amount
: 
"30"
,date_time
: 
"Tue Dec 12 2023 17:34:07 GMT+0530"
,donation_id
: 
"16"
,img1
: 
"api/adoptionImage/rescue.jpg"
,name
: 
"Da Costa's Shelter House"
  }
  donationsList:Donations[]=[];
  NoMoreOrders: boolean=false;
  constructor(
    private authService : AuthServiceService
  ) { 
    this.User = JSON.parse(localStorage.getItem('userData')!);
    this.PARAM.c_id = this.User.userData.customer_id;
    this.PARAM.offset = 0;
    this.imgUrl =authService.img();
  }

  ngOnInit() {
  
    this.getDonationHistory();
  }

  getDonationHistory()
  {
    this.Loading=true;
    this.authService.postData(this.PARAM,'loadDonationHistory').then((res:any)=>{
      console.log(res)
      let donations:Donations[] = res.donations;
      if(donations.length > 0)
      {
        this.donationsList = this.getFormatedData(donations);
      }else{
        console.error("no donations Made");
        
      }
    }).catch((error)=>{ 
      console.error(error);
    }).finally(()=>{  this.Loading=false;})
  }
  getFormatedData(data : Donations[]):Donations[]
  {
    let donations:Donations[]=[];
    data.forEach((ele:Donations) => {
      let a:Donations ={
        amount: ele.amount,
        date_time: ele.date_time,
        donation_id: ele.donation_id,
        img1: this.imgUrl + ele.img1,
        name: ele.name
      }
      donations.push(a);
    });

    return donations;
  }
  infiniteScroll(e:InfiniteScrollCustomEvent)
  {
    this.PARAM.offset = this.donationsList.length;    
    this.authService.postData(this.PARAM,'loadDonationHistory').then((res:any)=>{
      let donations:Donations[] = res.donations;
      if(donations.length > 0)
      {
       let data=this.getFormatedData(donations);
        this.donationsList.push(...data); 
       
      }else{
        console.error("no More Donations");
        this.NoMoreOrders=true;
      }


    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      e.target.complete();
    })

  }

}
