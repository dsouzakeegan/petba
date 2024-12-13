import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { WriteReviewPage } from '../write-review/write-review.page';
import { ModalController } from '@ionic/angular';
interface review {
  id: string;
  name: string;
  rating: string;
  readmore: boolean;
  review: string;
  time: string;
  vet_id: string;
}
interface dataResult {
  bName: string;
  rating: string;
  address: string;
  open_time: string;
  close_time: string;
  fee: string;
  about: string;
  rtDescription: string;
  pName: string;
  pImg: string;
  pExp: string;
  gender: string;
  pabout: string;
  phone: string;
  pQualification: string;
  profession: string;
  longitude: string;
  latitude: string;
  pReadMore: boolean;
  bReadMore: boolean;
  reviews: review[];
}


@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
  allReviews={id:"",type:"",offset:0}
  isLoading=true;
  noMoreReviews=false;
  userPlaceholderImg="https://placehold.co/600x400";
  details_title:string="";
  reviews:review[]=[]
  pReadMore=false;
  showmore=false;
  data:dataResult={
    bName:"",rating:"",address:"",open_time:"",close_time:"",fee:"",about:"",rtDescription:"",pName:"",pImg:"",pExp:"",gender:"" ,pabout:"",phone:""
    ,pQualification:"",profession:"",longitude:"",latitude:"",pReadMore:false,bReadMore:false,reviews:[]
  }
  // review:string=" Lorem ipsum dolor sit amet consectetur adipisicing elitLaborum accusamuseeeeeeeeeeeeeeeeeeeee wewwwwwwwwwwwwe  e w ewe  eeeeeee deleniti, mollitia minus hic debitis voluptates nemowswqswwedwedwdwdwdwewdw"
  // img=[
  //   "https://www.shutterstock.com/image-photo/border-collie-dog-woman-on-600nw-1817357840.jpg"
  //   ,"https://bpanimalhospital.com/wp-content/uploads/shutterstock_1547371985.jpg"
  //   ,"https://www.dailypaws.com/thmb/ThXkQgL3kYZ3WYBveZbyfsYUhsg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/dog-with-a-vet-2000-c24fb51b5759489388f882990f02e8a0.jpg"
  //   ,"https://dogsbestlife.com/wp-content/uploads/2021/01/fostering-dogs-jack-russell-scaled.jpeg"
    
  // ]
  img :string[]=[];
  imgPlaceholder=['../../../../../assets/error/fallback-image.png']
  _TYPE: string;
  imgUrl :string;
  dataParams={id:""};
  reviewsLoading: boolean=false;
  constructor(
    private router:ActivatedRoute
    ,private authService :AuthServiceService
    ,private modalCtrl:ModalController
  ) {
    this.imgUrl=authService.img();
    this._TYPE =this.router.snapshot.paramMap.get('type')!;
  this.dataParams.id = this.router.snapshot.paramMap.get('id')!;
  this.allReviews.type=this._TYPE;
  this.allReviews.id=this.dataParams.id;
    // console.log(`Type : ${this._TYPE} id : ${id}`);
   }
   
   speciality:{id:string ,name:string ,filters: {filter_id: string, name: string, filter_group_id: string}[]}[]=[];
  ngOnInit() {
    this.getList();
  }
  getList()
  {
    this.isLoading=true;
    // Vets
    if(this._TYPE == '1')
    {

      this.details_title="Doctor Details";
      this.getVetDetails();
    }
    // Shelter
    else if(this._TYPE == '2')
    {
      this.details_title="Owner details";
    this.getShelterDetails();
    }
    // Groomer
    else if(this._TYPE == '3')
    {
      this.details_title="Groomer Details";
      this.getGroomerDetails();
    }
    // Trainer
    else if(this._TYPE == '4')
    {
      this.details_title="Trainer Details";
      this.getTrainerDetails();
    }
    // Foster
    else if(this._TYPE == '5')
    {
      this.details_title="Foster Details";
      this.getFosterDetails();
    }
  }
  
  getVetDetails() {
    this.authService.postData(this.dataParams,'LoadVetDetails').then((res:any)=>{
      console.log(res)

   
      if( res.Vet.img1)
      { 
        this.img.push(this.imgUrl+res.Vet.img1);
       
      } 
      if(  res.Vet.img2)
      {
        this.img.push( this.imgUrl+res.Vet.img2);
      }
      if(  res.Vet.img3)
      {
        this.img.push( this.imgUrl+res.Vet.img3); 
      } 
      if(  res.Vet.img4)
      {
        this.img.push( this.imgUrl+res.Vet.img4);
      }
      /////// VETS
    this.data.bName=res.Vet.name && res.Vet.name;
    this.data.rating=res.Vet.rating && res.Vet.rating;
    this.data.address=res.Vet.address && res.Vet.address;
    this.data.open_time=res.Vet.open_time && res.Vet.open_time;
    this.data.close_time=res.Vet.close_time && res.Vet.close_time;
    this.data.fee=res.Vet.fee && res.Vet.fee;
    this.data.latitude=res.Vet.latitude && res.Vet.latitude;
    this.data.longitude=res.Vet.longitude && res.Vet.longitude;
    this.data.about=res.Vet.description && res.Vet.description;
    this.data.phone=res.Vet.phoneNumber && res.Vet.phoneNumber;
    this.data.rtDescription=res.Vet.d_description && res.Vet.d_description;
    this.data.pName=res.Vet.doctor && res.Vet.doctor;
    this.data.profession=res.Vet.details && res.Vet.details;
    this.data.pExp=res.Vet.experience && res.Vet.experience;
    this.data.pabout=res.Vet.about && res.Vet.about;
    this.data.gender=res.Vet.gender && res.Vet.gender;
    this.data.pImg=res.Vet.doc_img && this.imgUrl+res.Vet.doc_img;


    if(res.filters.length > 0)
    {

      let FilterGroup :any[]= res.filterGroup
      let Filters :any[]= res.filters
     this.speciality=FilterGroup.map((el)=>{
        let arr=[]
       arr= Filters.filter((ele)=>(el.id == ele.filter_group_id)
         
        ).map((filteredItem) => ({
          ...filteredItem,
        }));
        if(arr.length > 0)
        {

          return{
            ...el,
            filters : arr
          }
        } 
          return null

      }).filter((filteredObj) => filteredObj !== null);

      console.warn(this.speciality);
    }
      if(res.reviews.length > 0)
      {

        this.data.reviews=res.reviews.map((item:review )=>({...item ,readmore:false}) );
        console.log("reviews" ,this.data.reviews)
      }else{
        // this.noreviews =true
        console.log("no reviews")
      }

      // this.loadingSpinner.dismiss()
    }).catch((err)=>{
      console.error(err)
      // this.loadingSpinner.dismiss()
    }).finally(()=>{
      this.isLoading=false;
    });
  }
  getShelterDetails() {
    this.authService.postData(this.dataParams, "shelterDetails").then((result:any) =>{

      console.log("Responce data.....",result);
      if(result.shelterDetails){
        
      
        if( result.shelterDetails.img1)
        { 
          this.img.push(this.imgUrl+result.shelterDetails.img1);
         
        } 
        if(  result.shelterDetails.img2)
        {
          this.img.push( this.imgUrl+result.shelterDetails.img2);
        }
        if(  result.shelterDetails.img3)
        {
          this.img.push( this.imgUrl+result.shelterDetails.img3); 
        } 
        if(  result.shelterDetails.img4)
        {
          this.img.push( this.imgUrl+result.shelterDetails.img4);
        }
        /////// VETS
      this.data.bName=result.shelterDetails.name && result.shelterDetails.name
      this.data.rating=result.shelterDetails.rating && result.shelterDetails.rating
      this.data.address=result.shelterDetails.address && result.shelterDetails.address
      this.data.open_time=result.shelterDetails.open_time && result.shelterDetails.open_time
      this.data.close_time=result.shelterDetails.close_time && result.shelterDetails.close_time
      this.data.fee=result.shelterDetails.fee && result.shelterDetails.fee
      this.data.latitude=result.shelterDetails.latitude && result.shelterDetails.latitude
      this.data.longitude=result.shelterDetails.longitude && result.shelterDetails.longitude
      this.data.about=result.shelterDetails.description && result.shelterDetails.description
      this.data.phone=result.shelterDetails.phoneNumber && result.shelterDetails.phoneNumber
      this.data.rtDescription=result.shelterDetails.d_description && result.shelterDetails.d_description
      this.data.pName=result.shelterDetails.owner && result.shelterDetails.owner
      this.data.profession=result.shelterDetails.details && result.shelterDetails.details
      this.data.pExp=result.shelterDetails.experience && result.shelterDetails.experience
      this.data.pabout=result.shelterDetails.about && result.shelterDetails.about
      this.data.gender=result.shelterDetails.gender && result.shelterDetails.gender
      this.data.pImg=result.shelterDetails.doc_img && this.imgUrl+result.shelterDetails.doc_img

      if(result.filters.length > 0)
      {
  
        let FilterGroup :any[]= result.filterGroup
        let Filters :any[]= result.filters
       this.speciality=FilterGroup.map((el)=>{
          let arr=[]
         arr= Filters.filter((ele)=>(el.id == ele.filter_group_id)
           
          ).map((filteredItem) => ({
            ...filteredItem,
          }));
          if(arr.length > 0)
          {
  
            return{
              ...el,
              filters : arr
            }
          } 
            return null
  
        }).filter((filteredObj) => filteredObj !== null);
  
        console.warn(this.speciality);
      }
        if(result.reviews.length > 0)
        {
  
          this.data.reviews=result.reviews.map((item:review )=>({...item ,readmore:false}) );
          console.log("reviews" ,this.data.reviews)
        }else{
          // this.noreviews =true
          console.log("no reviews")
        }
  
    }else{
      // console.log("empty");
    }
   
  }).catch((err)=>{
      console.log(err);
  }).finally(()=>{
    this.isLoading=false;
  });
  }
  getFosterDetails() {
    throw new Error('Method not implemented.');
  }
  getTrainerDetails() {
    this.authService.postData(this.dataParams, "LoadTrainningDetails").then((result:any) =>{

    if( result.trainerDetails.img1)
    { 
      this.img.push(this.imgUrl+result.trainerDetails.img1);
     
    } 
    if(  result.trainerDetails.img2)
    {
      this.img.push( this.imgUrl+result.trainerDetails.img2);
    }
    if(  result.trainerDetails.img3)
    {
      this.img.push( this.imgUrl+result.trainerDetails.img3); 
    } 
    if(  result.trainerDetails.img4)
    {
      this.img.push( this.imgUrl+result.trainerDetails.img4);
    }

    // this.data.bName          =  result.trainerDetails.name ;
    // this.data.rating         =  result.trainerDetails.rating ;
    // this.data.address        =  result.trainerDetails.address ;
    // this.data.open_time      =  result.trainerDetails.open_time ;
    // this.data.close_time     =  result.trainerDetails.close_time ;
    // this.data.fee            =  result.trainerDetails.fee ;
    // this.data.latitude       =  result.trainerDetails.latitude ;
    // this.data.longitude      =  result.trainerDetails.longitude ;
    // this.data.about          =  result.trainerDetails.description ;
    // this.data.phone          =  result.trainerDetails.phoneNumber ;
    // this.data.rtDescription  =  result.trainerDetails.d_description ;
    // this.data.pName          =  result.trainerDetails.doctor ;
    // this.data.profession     =  result.trainerDetails.details ;
    // this.data.pExp           =  result.trainerDetails.experience ;
    // this.data.pabout         =  result.trainerDetails.about ;
    // this.data.gender         =  result.trainerDetails.gender ;
    // this.data.pImg           =  result.trainerDetails.doc_img .trainerDetails.doc_img;

    this.data.bName          =  result.trainerDetails.name && result.trainerDetails.name ;
    this.data.rating         =  result.trainerDetails.rating && result.trainerDetails.rating ;
    this.data.address        =  result.trainerDetails.address && result.trainerDetails.address ;
    this.data.open_time      =  result.trainerDetails.open_time && result.trainerDetails.open_time ;
    this.data.close_time     =  result.trainerDetails.close_time && result.trainerDetails.close_time ;
    this.data.fee            =  result.trainerDetails.fee && result.trainerDetails.fee ;
    this.data.latitude       =  result.trainerDetails.latitude && result.trainerDetails.latitude ;
    this.data.longitude      =  result.trainerDetails.longitude && result.trainerDetails.longitude ;
    this.data.about          =  result.trainerDetails.description && result.trainerDetails.description ;
    this.data.phone          =  result.trainerDetails.phoneNumber && result.trainerDetails.phoneNumber ;
    this.data.rtDescription  =  result.trainerDetails.d_description && result.trainerDetails.d_description ;
    this.data.pName          =  result.trainerDetails.trainer && result.trainerDetails.trainer ;
    this.data.profession     =  result.trainerDetails.details && result.trainerDetails.details ;
    this.data.pExp           =  result.trainerDetails.experience && result.trainerDetails.experience ;
    this.data.pabout         =  result.trainerDetails.about && result.trainerDetails.about ;
    this.data.gender         =  result.trainerDetails.gender && result.trainerDetails.gender ;
    this.data.pImg           =  result.trainerDetails.trainer_img && result.trainerDetails.trainer_img ;
     
         
       
    if(result.filters.length > 0)
    {

      let FilterGroup :any[]= result.filterGroup
      let Filters :any[]= result.filters
     this.speciality=FilterGroup.map((el)=>{
        let arr=[]
       arr= Filters.filter((ele)=>(el.id == ele.filter_group_id)
         
        ).map((filteredItem) => ({
          ...filteredItem,
        }));
        if(arr.length > 0)
        {

          return{
            ...el,
            filters : arr
          }
        } 
          return null

      }).filter((filteredObj) => filteredObj !== null);

      console.warn(this.speciality);
    }
      if(result.reviews.length > 0)
      {

        this.data.reviews=result.reviews.map((item:review )=>({...item ,readmore:false}) );
        console.log("reviews" ,this.data.reviews)
      }else{
        // this.noreviews =true
        console.log("no reviews")
      }
     
    }).catch((err)=>{
      console.error(err);
    }).finally(()=>{
      this.isLoading=false;
    });
  }
  getGroomerDetails() {
    this.authService.postData(this.dataParams, "LoadGroomingDetails").then((result:any) =>{
      if( result.Groomerdetails.img1)
      { 
        this.img.push(this.imgUrl+result.Groomerdetails.img1);
       
      } 
      if(  result.Groomerdetails.img2)
      {
        this.img.push( this.imgUrl+result.Groomerdetails.img2);
      }
      if(  result.Groomerdetails.img3)
      {
        this.img.push( this.imgUrl+result.Groomerdetails.img3); 
      } 
      if(  result.Groomerdetails.img4)
      {
        this.img.push( this.imgUrl+result.Groomerdetails.img4);
      }
    this.data.bName          =  result.Groomerdetails.name ;
    this.data.rating         =  result.Groomerdetails.rating ;
    this.data.address        =  result.Groomerdetails.address ;
    this.data.open_time      =  result.Groomerdetails.open_time ;
    this.data.close_time     =  result.Groomerdetails.close_time ;
    this.data.fee            =  result.Groomerdetails.fee ;
    this.data.latitude       =  result.Groomerdetails.latitude ;
    this.data.longitude      =  result.Groomerdetails.longitude ;
    this.data.about          =  result.Groomerdetails.description ;
    this.data.phone          =  result.Groomerdetails.phoneNumber ;
    this.data.rtDescription  =  result.Groomerdetails.d_description ;
    this.data.pName          =  result.Groomerdetails.groomer ;
    this.data.profession     =  result.Groomerdetails.details ;
    this.data.pExp           =  result.Groomerdetails.experience ;
    this.data.pabout         =  result.Groomerdetails.about ;
    this.data.gender         =  result.Groomerdetails.gender ;
    this.data.pImg           =  result.Groomerdetails.groomer_img ;

    if(result.filters.length > 0)
    {

      let FilterGroup :any[]= result.filterGroup
      let Filters :any[]= result.filters
     this.speciality=FilterGroup.map((el)=>{
        let arr=[]
       arr= Filters.filter((ele)=>(el.id == ele.filter_group_id)
         
        ).map((filteredItem) => ({
          ...filteredItem,
        }));
        if(arr.length > 0)
        {

          return{
            ...el,
            filters : arr
          }
        } 
          return null

      }).filter((filteredObj) => filteredObj !== null);

      console.warn(this.speciality);
    }
      if(result.reviews.length > 0)
      {

        this.data.reviews=result.reviews.map((item:review )=>({...item ,readmore:false}) );
        console.log("reviews" ,this.data.reviews)
      }else{
        // this.noreviews =true
        console.log("no reviews")
      }
     
    }).catch((err)=>{
      console.error(err);
    }).finally(()=>{
      this.isLoading=false;
    });
  }
  async loadAllReviews(){
    this.reviewsLoading=true;
    this.reviews=[];
    this.allReviews.offset=0;
    await  this.authService.postData(this.allReviews,'LoadReviews').then((res:any)=>{
      if(res.reviews.length > 0)
      {
        this.allReviews.offset += res.reviews.length;
        this.reviews=res.reviews.map((item:review )=>({...item ,readmore:false}) );
        
        console.log("reviews" ,this.reviews)
      }else{
        // this.noreviews =true
        console.log("no reviews")
        this.noMoreReviews =true;
      }
    }).catch((err)=>{
      console.error(err)
    }).finally(()=>{
      this.reviewsLoading=false;
    })

  }
async loadMoreReviews(){
  this.reviewsLoading=true;
  await  this.authService.postData(this.allReviews,'LoadReviews').then((res:any)=>{
    if(res.reviews.length > 0)
    {
      this.allReviews.offset += res.reviews.length;
      let reviewNew =res.reviews.map((item:review )=>({...item ,readmore:false}) );
      this.reviews.push(...reviewNew)
      console.log("reviews" ,this.reviews)
    }else{
      // this.noreviews =true
      console.log("no reviews")
      this.noMoreReviews =true;
    }
  }).catch((err)=>{
    console.error(err)
  }).finally(()=>{
    this.reviewsLoading=false;
  })
}
getRColor(rating:string ,index :number,type:number=1) {
  let rate :number =Math.floor(parseFloat(rating)) ;
   if(type === 1)
   {

     switch (rate){
       case 1 : return 'danger'
       case 2 : return 'danger'
       case 3 : return 'primary'
       case 4 : return 'success'
       case 5 : return 'warning'
       default  :  return 'medium'
     }
   }else{
    if( (index+1)>rate)
{
  return 'medium'
}
switch (rate){
  case 1 : return 'danger'
  case 2 : return 'danger'
  case 3 : return 'primary'
  case 4 : return 'success'
  case 5 : return 'warning'
  default  :  return 'medium'
}
   }
  }
  
  async writeAReview()
  {
    const modal = await this.modalCtrl.create({
      component :WriteReviewPage,componentProps:{type:this._TYPE,id:this.dataParams.id}
    });
    modal.present();
  }
}
