import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface review {
  id: string;
  name: string;
  rating: number;
  review: string;
  type: string;
  time: string|Date;
}


@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.page.html',
  styleUrls: ['./write-review.page.scss'],
})
export class WriteReviewPage implements OnInit {
  reviewParams:review={
    id: "",
    name:"",
    rating: 0,
    review: "",
    type: "",
    time:""
}
rating=0;
review:string="";
  isSending: boolean=false;
  constructor(
    private authService :AuthServiceService
    ,private navParams:NavParams
    ,private modalCtrl :ModalController
  ) { 
    this.reviewParams.type = this.navParams.get('type');
    this.reviewParams.id = this.navParams.get('id');
    var  b = JSON.parse(localStorage.getItem("userData")!);
    this.reviewParams.name = b.userData.firstname+" "+b.userData.lastname;
    console.log(this.reviewParams);
  }

  ngOnInit() {
  }
  getRate(index: number) {
    // function used to change the value of our rating 
    // triggered when user, clicks a star to change the rating
    this.rating=index;
  }
  getColor(index: number) {
    if( index>this.rating)
    {
      return 'custom-light'
    }
    switch (this.rating){
      case 1 : return 'danger'
      case 2 : return 'danger'
      case 3 : return 'primary'
      case 4 : return 'success'
      case 5 : return 'warning'
      default  :  return 'medium'
    }
    } 
    customCounterFormatter(inputLength: number, maxLength: number) {
      return `${maxLength - inputLength} characters remaining`;
    }
    submitReview(){
      if(this.isSending === false)
      {
        this.isSending=true;

     
      if(this.rating > 0)
      {
        const reviewTrimmed = this.review.trim();
        if(reviewTrimmed.length >= 5)
        {
    this.reviewParams.rating=this.rating
    this.reviewParams.review=reviewTrimmed;
    if(this.reviewParams.review && this.reviewParams.rating && this.reviewParams.id && this.reviewParams.type && this.reviewParams.name )
    {
      this.sendReview();
    }else{
      this.isSending=false;

      console.error("Error in Params");
      console.error(this.reviewParams);
    }
        }else{
          this.isSending=false;
          console.error("Review is too short , need atleast 5 characters")
        }
      }else{
        this.isSending= false;
        console.error("rating cannot be zero")
      }
    }else{
      console.error("submitting still... ")
    }
    }
    async sendReview()
    {
      this.reviewParams.time = new Date();
     await this.authService.postData(this.reviewParams,'sendVetReview').then((res :any)=>{
    
      this.review = "";
      this.rating=0;
      this.reviewParams.rating=0;
      this.reviewParams.review="";
      this.reviewParams.time="";
      this.review="";
      this.back();
      
    }).catch((err)=>{
      
        console.error("Avoi Kit Zal re !!",err)
      }).finally(()=>{
        this.isSending=false
      })
    }
  back() {
   this.modalCtrl.dismiss();
  }
  }
