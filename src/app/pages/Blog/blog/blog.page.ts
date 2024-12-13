import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface blog {
  id:string;
  like_count:number;
  description: string;
  img: string;
  published: string;
  subtitle: string;
  title: string;
  author: string;
  author_id: string;
  auth_img: string;
}
interface comment {
  b_time: string;
  blog_id: string;
  comment: string;
  firstname: string;
  from_id: string;
  id: string;
  img: string;
  lastname: string;
}


@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
liked:boolean=false;
commentMessage:string="";
loadingCommentModal:boolean=false;
blogCommentLoading:boolean=true;
isPostingComment:boolean=false;
// isLiking:any;
blogComment:comment[]=[];
blogAllComment:comment[]=[];
blog:blog= { id: "", title: "", subtitle: "", description: "", img: "", like_count: 0, published: "",auth_img:"",author:"",author_id :""}
blogParam={id:"",c_id:""}
commentParams={id:"",tag:'',next:0}
  blogImageUrl: string;
  pfpImageUrl: string;
  loadingBlog: boolean=true;
  NoMoreComments: boolean=false;
  loadingAllComment: boolean =false;
  pfpImg: string;
  isLiking: any; 
  // customer_id:string;
  constructor(
    private router :ActivatedRoute
    ,private authService :AuthServiceService
  ) {
    // this.customer_id=JSON.parse(localStorage.getItem('userData')!).userData.customer_id ;
    this.blogParam.c_id=JSON.parse(localStorage.getItem('userData')!).userData.customer_id ;
    this.blogParam.id = router.snapshot.paramMap.get('blog-id')!;
    // this.blogParam.id = this.customer_id;
    this.commentParams.id=this.blogParam.id;
    this.blogImageUrl=this.authService.blogImg();
    this.pfpImageUrl=this.authService.img();
    this.pfpImg=this.authService.img();
   }

  ngOnInit() {
    this.getBlog();
  }
 async getBlog()
  {
    this.loadingBlog =true;
    await this.authService.postData(this.blogParam, "blog").then((result :any) =>{
  this.LoadComments();
      let data = result.blog;
      this.blog.id=data.id;
      this.blog.title=data.title;
      this.blog.subtitle=data.subtitle;
      this.blog.description=data.description;
      this.blog.img=this.blogImageUrl+data.img;
      this.blog.like_count=data.like_count;
      this.blog.published=data.published;
      this.blog.author=data.author;
      this.blog.author_id=data.author_id;
      this.liked= data.liked=='true'?true:false ;
      this.blog.auth_img= this.pfpImageUrl+data.auth_img;
      
    }).catch((err) =>{
      console.error(err);
    }).finally(()=>{
      this.loadingBlog =false;

    })
  }
 async checkLiked()
  {
    this.commentParams.tag = "4";
    this.commentParams.next=0;
    await this.authService.postData({c_id:''},'checkBlogLiked').then((res:any)=>{
      console.log(res.loadcomment)
      if(res.loadcomment.length  > 0)
      {

  }else{
    console.error("No comments...")
  }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{

    })
  }
 async LoadComments()
  {
    this.blogCommentLoading=true;
    this.commentParams.tag = "4";
    this.commentParams.next=0;
    await this.authService.postData(this.commentParams,'loadBlogcomment').then((res:any)=>{
      console.log(res.loadcomment)
      if(res.loadcomment.length  > 0)
      {
        let comment:comment[] =res.loadcomment;
        comment.forEach(item => {
          let a ={
            b_time: item.b_time,
            blog_id: item.blog_id,
            comment: item.comment,
            firstname: item.firstname,
            from_id: item.from_id,
            id: item.id,
            img: this.pfpImg+item.img,
            lastname: item.lastname,
          }
         this.blogComment.push(a);
        });

    //  this.blogComment = res.loadcomment;
  }else{
    console.error("No comments...")
  }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      this.blogCommentLoading=false;
    })
  }

 async loadMoreComments()
  {
    this.loadingAllComment=true;
    this.commentParams.tag = "4";
    // this.commentParams.next=0;
    await this.authService.postData(this.commentParams,'loadBlogcomment').then((res:any)=>{
      console.log(res.loadcomment)
      if(res.loadcomment.length  > 0)
      {
        this.commentParams.next += res.loadcomment.length;   
        // this.blogAllComment.push(...res.loadcomment);
        let comment:comment[] =res.loadcomment;
        comment.forEach(item => {
          let a ={
            b_time: item.b_time,
            blog_id: item.blog_id,
            comment: item.comment,
            firstname: item.firstname,
            from_id: item.from_id,
            id: item.id,
            img: this.pfpImg+item.img,
            lastname: item.lastname,
          }
         this.blogAllComment.push(a);
        });

  }else{
    this.NoMoreComments =true;
    console.error("No more comments...")
  }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      this.loadingAllComment=false;

    })
  }
 async loadAllComments()
  { 
    this.loadingCommentModal=true;
    this.loadingAllComment=true;
    this.blogAllComment=[];
    this.NoMoreComments=false;
    this.commentParams.tag = "4";
    this.commentParams.next=0;
    await this.authService.postData(this.commentParams,'loadBlogcomment').then((res:any)=>{
      console.log(res.loadcomment)
      if(res.loadcomment.length  > 0)
      {
        this.commentParams.next += res.loadcomment.length;   
        // this.blogAllComment = res.loadcomment;
        let comment:comment[] =res.loadcomment;
        comment.forEach(item => {
          
          let a ={
            b_time: item.b_time,
            blog_id: item.blog_id,
            comment: item.comment,
            firstname: item.firstname,
            from_id: item.from_id,
            id: item.id,
            img: this.pfpImg+item.img,
            lastname: item.lastname,
          }
         this.blogAllComment.push(a);
        });


  }else{
    this.NoMoreComments =true;
    console.error("No comments...")
  }
    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      this.loadingAllComment=false;
      this.loadingCommentModal=false;

    })
  }

  likeToggle()
  {
    this.liked =!this.liked;
    if (this.liked==true) {this.blog.like_count++}
     else{ this.blog.like_count--} 
    // console.log("before clear : ",this.isLiking)
    if(this.isLiking)
    {
     clearTimeout(this.isLiking);
    //  console.log("after clear : ",this.isLiking)
     
    }
    this.debounce();
  }
  likeBlog(liked:number)
  {
    
    this.authService.postData({
      c_id:this.blogParam.c_id,
      blog_id:this.blogParam.id,
      liked:liked
  },'BlogLiked').then((res:any)=>{}).catch((err)=>{console.error(err)}).finally(()=>{
      
    })
  }
  debounce(delay = 3000)
  {
   this.isLiking = setTimeout(()=>{
      if(this.liked === true)
      {
        this.likeBlog(1);
        console.log("💝");
      }else{
        this.likeBlog(0);
        console.log("💔");
      }
      
    },delay)
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
          
      
          this.authService.postData({post:commentMessage,c_id:this.blogParam.c_id,blog_id:this.blogParam.id,b_time:new Date()},"postBcomment").then((result:any) =>{
            this.commentMessage = "";
            if(result.Post){
            // console.log(result);
//             let rwswd={

// b_time:"2024-05-20T12:04:29.905Z"
// ,blog_id:"1"
// ,comment:"s"
// ,firstname:"Julia"
// ,from_id:"48"
// ,id:"6"
// ,img:"api/profilepic/MyProfilePic_48_1714564856.jpg"
// ,lastname:"Pacheco"
// }
          // let b_time=result.Post.b_time;
          // let blog_id=result.Post.blog_id;
          // let comment=result.Post.comment;
          // let firstname=result.Post.firstname; 
          // let from_id = result.Post.from_id;
          // let id=result.Post.id;
          // let img=result.Post.img;
          // let lastname = result.Post.lastname;



          //   //   let item =result.Post;
          //     let a:comment ={
          //       b_time: b_time,
          //       blog_id: blog_id,
          //       comment: comment,
          //       firstname: firstname,
          //       from_id: from_id,
          //       id: id,
          //       img: this.pfpImg+img,
          //       lastname: lastname,
          //     }
          //    this.blogAllComment.push(a);
          //    this.blogComment.push(a);
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
}
