import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
})
export class BlogsPage implements OnInit {
  Loading: boolean=true;

  
  blogParams :{c_id:string,offset:number,type:string}={c_id :"",offset:0,type:'1'}
  blogImageUrl: string;
  blogs: { id: string; title: string; subtitle: string; description: string; img: string; like_count: number; customer_id: string; date_time: string;author:string;auth_img:string }[]=[];
  pfpImageUrl: string;
  constructor(
    private authService : AuthServiceService
  ) {
    // this.blogParams.c_id=JSON.parse(localStorage.getItem('userData')!).userData.customer_id ;
    this.blogImageUrl=this.authService.blogImg();
    this.pfpImageUrl=this.authService.img();
   }

  ngOnInit() {
    // this.getBlogse();
    this.getBlogs();
  }
  getBlogs()
  {
    this.blogs=[]
    this.Loading =true;
    this.authService.postData(this.blogParams, "bloglist").then((result:any) =>{
      if(result.bloglist.length > 0){
        var prop=[];
        for (let ado of result.bloglist){
          let id=ado.id;
          let title=ado.title;
          let subtitle=ado.subtitle;
          let description=ado.description;
          let img=this.blogImageUrl + ado.img;
          let like_count=ado.like_count;
          let customer_id=ado.customer_id;
          let date_time=ado.date_time;
          let author=ado.author;
          let auth_img= this.pfpImageUrl + ado.auth_img;
          // if(customer_id==this.c_id){
            
          // }
          let proc =  {
              id:id,
              title:title,
              subtitle:subtitle,
              description:description,
             img:img,
             like_count:like_count,
             customer_id:customer_id,
             date_time:date_time,
             author:author,
             auth_img:auth_img
          }
      prop.push(proc);       
     
       
      }
      this.blogs=prop;
        // console.log("Success ",this.blogs);
        
}else{
}


}).catch((err) =>{

  console.error(err);
}).finally(()=>{
  this.Loading =false;
});
  }
//   getBlogse()
//   {
// setTimeout(() => {
//   this.Loading=false
// }, 3000);
//   }
}
