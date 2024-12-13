import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ShareService } from 'src/app/services/share.service';
import { EditRescuePage } from '../../edit-rescue/edit-rescue.page';
interface rescuePet {
  c_id: string;
  id: string;
  customer_id: string;
  condition_id: string;
  conditionLevel_id: string;
  animal_id: string;
  gender: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  city: string;
  city_id: string;
  address: string;
  latitude: string;
  longitude: string;
  description: string;
  status: string;
  date_time: string;
  name: string;
}

@Component({
  selector: 'app-rescue',
  templateUrl: './rescue.page.html',
  styleUrls: ['./rescue.page.scss'],
})
export class RescuePage implements OnInit {
  readMore:boolean=false;
  noMoreComments=false;
  Loading:boolean =true;
  loadingComments:boolean =true;

  rescuePetParams:{id:string}={id:""};
  rescuePet: rescuePet = {c_id: "",id: "",customer_id: "",condition_id: "",conditionLevel_id: "",animal_id: "",gender: "",img1: "",img2: "",img3: "",img4: "",img5: "",img6: "",city: "",city_id: "",address: "",latitude: "",longitude: "",description: "",status: "",date_time: "",name: ""};
  customer_id:string;
  
  // img=[
  //   "https://dogwithblog.in/wp-content/uploads/2020/05/resq-pune.jpg"
  //   ,"https://static.punemirror.com/full/e55890c6-b2de-4671-895f-efe48bce878d.webp"
  // ]
  img:string[]=[];
  // imgUser="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt-JmDfLz7ErRiTZ9vIme55A9JGQqdx8qJ_xQ_lB2UIqGAFELpsKQQ8xuTSrlqrly-tSQ&usqp=CAU"
  comments:any[]=[]
  imgUrl: string;
  bookMarked: boolean|undefined=undefined;
  ismarking = true;
  allComments: any[]=[];
  loadingAllComments: boolean=true;
  isPostingComment: boolean=false;
  commentMessage: string="";
  constructor(
    private authService : AuthServiceService,
    private router : ActivatedRoute,
    private modalCtrl: ModalController,
    private Share : ShareService,
  ) {
    this.rescuePetParams.id  = this.router.snapshot.paramMap.get('rescue-id')!;
    this.customer_id = JSON.parse(localStorage.getItem("userData")!).userData.customer_id;
    this.imgUrl = this.authService.img();
   }
  ngOnInit() {
    this.getRescuePetdetails();
  }


  bookMarkCheck(){
    this.authService.postData({flag:'',c_id:this.customer_id,rescue_id:this.rescuePetParams.id},'toggleCheck').then((result:any)=>{
      if(result.toggleCheck){
        this.bookMarked=true;
        // console.log("toggle ",this.bookMarked);
      }else{
        this.bookMarked=false;
        console.log("toggle"+this.bookMarked);
      }
     }).catch((error)=>{console.error(error)}).finally(()=>{this.ismarking=false});
  
  }
  getRescuePetdetails(){
    this.Loading=true;
    this.img=[];
   this.authService.postData(this.rescuePetParams,'showRescuePet').then((result:any)=>{

    if(result.showRescuePet){
      this.bookMarkCheck();
      this.loadcomment();
      let resp:rescuePet = result.showRescuePet;
      // this.rescuePet.img1=resp.img1;
      // this.rescuePet.img2=resp.img2;
      // this.rescuePet.img3=resp.img3;
      // this.rescuePet.img4=resp.img4;
      // this.rescuePet.img5=resp.img5;
      // this.rescuePet.img6=resp.img6;
      this.rescuePet.c_id=resp.customer_id;
      this.rescuePet.description=resp.description;
      if(resp.city)
      {
              
        this.rescuePet.address=resp.city+','+resp.address;
      }else{
        this.rescuePet.address=resp.address;
      }
      this.rescuePet.city=resp.city;
      this.rescuePet.latitude=resp.latitude;
      this.rescuePet.longitude=resp.longitude;
      this.rescuePet.status=resp.status;
          if(resp.img1!=""){
            let a=this.imgUrl+resp.img1
            this.rescuePet.img1=a;
            this.img.push(a);
          }
          if(resp.img2!=""){
            let a=this.imgUrl+resp.img2;
            this.rescuePet.img2=a;
            this.img.push(a);
          }
          if(resp.img3!=""){
            let a=this.imgUrl+resp.img3;
            this.rescuePet.img3=a;
            this.img.push(a);
          }
          if(resp.img4!=""){
            let a=this.imgUrl+resp.img4;
            this.rescuePet.img4=a;
            this.img.push(a);
          }
          if(resp.img5!=""){
            let a=this.imgUrl+resp.img5;
            this.rescuePet.img5=a;
            this.img.push(a);
          }
          if(resp.img6!=""){
            let a=this.imgUrl+resp.img6;
            this.rescuePet.img6=a;
            this.img.push(a);
          }
     
    }else{
      this.Loading=false;
      console.error("pet not found :(");
    }
   }).catch((error)=>{console.error(error)}).finally(()=>{this.Loading=false;})

  }
  mark(){ 
    // console.log("marking...")
    if(!this.ismarking)
    {
      this.ismarking =true;
      this.bookMarked ? this.bookMark('0') : this.bookMark('1');
      
      // this.bookMarked=!this.bookMarked
      
      // if(this.bookMarked){
        // console.log("later check :",this.bookMarked);
      //   this.bookMark('1');
      // } else{
      //   // console.log("later check :",this.bookMarked);
      //   this.bookMark('0');
      // }
    }else{
      console.error("please wait....")
    } 
  }
  bookMark(flag: string) {
    this.authService.postData({flag:flag,c_id:this.customer_id,rescue_id:this.rescuePetParams.id},'marked').then((result:any)=>{
      // console.log("please ",result)    
        this.bookMarked =result.res;
     }).catch((error)=>{console.error(error)}).finally(()=>{this.ismarking = false});
  
  }
  loadcomment(){
    this.loadingComments =true;
    this.comments=[];
     this.authService.postData({id:this.rescuePetParams.id,tag:'4'},"loadcomment").then((result:any)=>{
      if(result.loadcomment){
        var pp= [];
        // if(result.loadcomment.length<1){
        //   this.show=true;
        // }else{
        //   this.show=false;
        // }
   
        
        for (let ado of result.loadcomment){
  
          let id=ado.id;
          let from_id = ado.from_id;
          let lastname = ado.lastname;
          let rescue_id=ado.rescue_id;
          let comment=ado.comment;
          let firstname=ado.firstname; 
          let c_time=ado.c_time;
          let comment_date = ado.date;
          let comment_time = ado.AmPm;
          // c_time = moment(c_time);
          // let a = 
            //  c_time=c_time.from();
             c_time=c_time;
     
          
          let proc =  {
              id:id,
              from_id:from_id,
              name:firstname+" "+lastname,
              rescue_id:rescue_id,
              comment:comment,
              c_time:c_time,
              comment_date: comment_date,
              comment_time : comment_time
            }  
          pp.push(proc);    
          // console.log("For each "+proc);
        }
   
            this.comments=pp; 
            console.log("Comment ");
            console.log(this.comments);
            
      }
      else{
        // this.show=true;
    }
     }).catch((error)=>{console.error(error)}).finally(()=>{this.loadingComments = false});}
  loadAllComments()
  {
    this.loadingAllComments =true;
    this.noMoreComments=false;
    this.allComments =[];
    this.authService.postData({id:this.rescuePetParams.id,tag:'20'},"loadcomment").then((result:any)=>{
     if(result.loadcomment.length > 0 ){
      if(result.loadcomment.length < 20 ) {
     
        this.noMoreComments =true;
    }
       var pp= [];
       
       for (let ado of result.loadcomment){
 
         let id=ado.id;
         let from_id = ado.from_id;
         let lastname = ado.lastname;
         let rescue_id=ado.rescue_id;
         let comment=ado.comment;
         let firstname=ado.firstname; 
         let c_time=ado.c_time;
         let comment_date = ado.date;
         let comment_time = ado.AmPm;
         // c_time = moment(c_time);
         // let a = 
           //  c_time=c_time.from();
            c_time=c_time;
    
         
         let proc =  {
             id:id,
             from_id:from_id,
             name:firstname+" "+lastname,
             rescue_id:rescue_id,
             comment:comment,
             c_time:c_time,
             comment_date: comment_date,
             comment_time : comment_time
           }  
         pp.push(proc);    
       }
  
           this.allComments=pp; 
           console.log("Comment ");
           console.log(this.allComments);
           
           
     }
    }).catch((error)=>{console.error(error)}).finally(()=>{this.loadingAllComments = false});
  }
  loadMoreComments()
  {
    console.log("Loading more comments")
    // this.loadingAllComments =true;
    this.authService.postData({id:this.rescuePetParams.id,tag:'5',offset:this.allComments.length},"loadcomment").then((result:any)=>{
     if(result.loadcomment.length > 0){
       this.noMoreComments=false;
       var pp= [];       
       for (let ado of result.loadcomment){
 
         let id=ado.id;
         let from_id = ado.from_id;
         let lastname = ado.lastname;
         let rescue_id=ado.rescue_id;
         let comment=ado.comment;
         let firstname=ado.firstname; 
         let c_time=ado.c_time;
         let comment_date = ado.date;
         let comment_time = ado.AmPm;
         // c_time = moment(c_time);
         // let a = 
           //  c_time=c_time.from();
            c_time=c_time;
    
         
         let proc =  {
             id:id,
             from_id:from_id,
             name:firstname+" "+lastname,
             rescue_id:rescue_id,
             comment:comment,
             c_time:c_time,
             comment_date: comment_date,
             comment_time : comment_time
           }  
         pp.push(proc);    
         // console.log("For each "+proc);
       }
  
           this.allComments.push( ...pp); 
           console.log("Comment ");
           console.log(this.allComments);
           
     }
     else{
      this.noMoreComments=true;
   }
    }).catch((error)=>{console.error(error)}).finally(()=>{
      // this.loadingAllComments = false;
        // (ev as InfiniteScrollCustomEvent).target.complete();
      });


  }
  addComment(){ 
    if(!this.isPostingComment){
     
       let commentMessage :string= this.commentMessage.trim();
      if (commentMessage != "") {
        console.log('POST  : ',commentMessage);
        if(commentMessage.length < 500)
        { 
       
  
          console.log("Comment length : ",commentMessage.length)
          this.isPostingComment=true;
          
      
          this.authService.postData({post:commentMessage,c_id:this.customer_id,rescue_id:this.rescuePetParams.id,c_time:new Date()},"postcomment").then((result:any) =>{
            if(result.Post){
              console.log(result);
    
              let id=result.Post.id;
          let from_id = result.Post.from_id;
          let lastname = result.Post.lastname;
          let rescue_id=result.Post.rescue_id;
          let comment=result.Post.comment;
          let firstname=result.Post.firstname; 
          let c_time=result.Post.c_time;
          let comment_date = result.Post.date;
          let comment_time = result.Post.AmPm;
            //  c_time=c_time;
     
          
          let proc =  {
              id:id,
              from_id:from_id,
              name:firstname+" "+lastname,
              rescue_id:rescue_id,
              comment:comment,
              c_time:c_time,
              comment_date: comment_date,
              comment_time : comment_time
            }  
             
                this.comments.push(proc);
                this.allComments.push(proc);
                this.commentMessage='';
          }
        }           
        ).catch((err)=>{
      
          console.log("Comment post err "+err);
        }).finally(()=>{ this.isPostingComment=false});  
      }else{
        console.error("Comment is too long : ",commentMessage.length);
      }
    }else{
      console.error('post cannot be EMPTY : ',commentMessage.length);
   
  
    }
     
  }else{
    console.error("Please wait ... still posting...")
  }

  }
 async share()
  {
  await  this.Share.shareRescue({link:`https://petba.in/rescue/${this.rescuePetParams.id}`});
  }
  async openModal(type:number)
  {
   const modal = await this.modalCtrl.create({
     component:EditRescuePage,componentProps:{rescue_id:this.rescuePetParams.id}
   });
   await modal.present();
   const {data,role }=await modal.onDidDismiss();
   if(role == 'confirm')
     {
      this.getRescuePetdetails();
     }
  }
}
