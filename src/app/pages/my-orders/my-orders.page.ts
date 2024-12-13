import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { User } from 'src/app/interfaces/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
// interface orderResultData {
//   address_1: string;
//   address_2: string;
//   city: string;
//   company: string;
//   date_modified: string;
//   firstname: string;
//   image: string;
//   lastname: string;
//   name: string;
//   order_id: string;
//   order_status: string;
//   payment_method: string;
//   postcode: string;
//   price: string;
//   product_id: string;
//   telephone: string;
// }
interface orderResultData {
  date_modified: string;
  image: string;
  name: string;
  order_id: string;
  order_status: string;
  payment_method: string;
  product_id: string;
  order_status_code: string;
}
interface TransformedOrders {
  date:"Previous orders"|"Ordered Today"|"Ordered Yesterday"|`Last 7 days Orders`|`Last 30 days Orders`,
  orders:orderResultData[]
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {
  NoMoreOrders=true;
  Loading:boolean=true;
  // ordersFetched=0
  PARAMS= {c_id:"",offset:0}
  User:User;
  // Orders=[
   
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
  //  ]
  imgUrl:string;
Orders:TransformedOrders[]=[];
  constructor(
    private authService : AuthServiceService,
  ) { 
    this.imgUrl=this.authService.img2();
    this.User = JSON.parse(localStorage.getItem('userData')!);
    this.PARAMS.c_id=this.User.userData.customer_id;
    this.PARAMS.offset=0;
  }

  ngOnInit() {
    this.getMyOrders();
  }

  getMyOrders()
  {
    this.Loading=true;
    this.NoMoreOrders=false;
    // let param = {c_id:this.User.userData.customer_id,offset:};
    this.authService.postData(this.PARAMS,'loadMyOrders').then((res:any)=>{
      let myOrders:orderResultData[]=res.MyOrders;
      if(myOrders.length > 0)
      {
        // this.Orders=this.transFormResult(myOrders); 
        // this.PARAMS.offset = this.Orders.length;    

        this.Orders=this.NewtransFormData(myOrders); 
        this.PARAMS.offset = myOrders.length;    
       
      }else{
        console.error("no orders yet");
        
      }


    }).catch((error)=>{console.error(error);
    }).finally(()=>{
    this.Loading=false;

    })
  }


  infiniteScroll(e:InfiniteScrollCustomEvent)
  {
    this.authService.postData(this.PARAMS,'loadMyOrders').then((res:any)=>{
      let myOrders:orderResultData[]=res.MyOrders;
      if(myOrders.length > 0)
      {
      //  let data=this.transFormResult(myOrders);
       let data=this.NewtransFormData(myOrders);
       data.forEach(orders => {
       
            this.Orders.forEach(Order => {
              if(Order.date == orders.date)
                {
                  Order.orders.push(...orders.orders)
                }
            });
          
        
       });
        // this.Orders.push(...data); 
        // this.PARAMS.offset = this.Orders.length;    

        this.PARAMS.offset += myOrders.length;    
       
      }else{
        console.error("no orders yet");
        this.NoMoreOrders=true;
      }


    }).catch((error)=>{
      console.error(error);
    }).finally(()=>{
      e.target.complete();
    })

  }

  transFormResult(array:orderResultData[]):orderResultData[]
  {
    let finalArray:orderResultData[]= [];
    array.forEach((order:orderResultData) => {
      let a :orderResultData={
        date_modified:order.date_modified,
        image: this.imgUrl+order.image,
        name: order.name,
        order_id: order.order_id,
        order_status: order.order_status,
        payment_method: order.payment_method,
        product_id: order.product_id,
        order_status_code: order.order_status_code
      }
      finalArray.push(a);
    });

    return finalArray;
  }



  NewtransFormData(res:orderResultData[])
  {
    let todayOrders:orderResultData[] = [];
    let yesterdayOrders :orderResultData[]= [];
    let thisWeekOrders:orderResultData[] = [];
    let thisMonthOrders:orderResultData[] = [];
    let olderOrders :orderResultData[]= [];
  res.forEach((order:orderResultData)=>
       {
        const notify ={
        date_modified:order.date_modified,
        image: this.imgUrl+order.image,
        name: order.name,
        order_id: order.order_id,
        order_status: order.order_status,
        payment_method: order.payment_method,
        product_id: order.product_id,
        order_status_code: order.order_status_code
        }
      // Get today's date
let today = new Date();

// Iterate through notifications

    // Convert order.date_modified to a Date object
    let OrderDate = new Date(order.date_modified);

    // Calculate the time difference in milliseconds
    let timeDiff = today.getTime() - OrderDate.getTime();
    let dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Categorize notifications based on time
    if (dayDiff === 0) {
        todayOrders.push(notify);
    } else if (dayDiff === 1) {
        yesterdayOrders.push(notify);
    } else if (dayDiff <= 7) {
        thisWeekOrders.push(notify);
    } else if (dayDiff <= 30) {
        thisMonthOrders.push(notify);
    } else {
        olderOrders.push(notify);
    }

      } 
    ) 

    let transformedData:TransformedOrders[] = [
      {
        date: 'Ordered Today',
        orders: todayOrders
    },
    {
        date: 'Ordered Yesterday',
        orders: yesterdayOrders
    },
    {
        date: 'Last 7 days Orders',
        orders: thisWeekOrders
    },
    {
        date: 'Last 30 days Orders',
        orders: thisMonthOrders
    },
    {
        date: 'Previous orders',
        orders: olderOrders
    }
    ]
   return transformedData;
  }
  getStatusColor(status:string):string
  {
    // Pending
    if(status == '1' || status == '2'){
      return 'warning'
    }else if(status=='3' || status=='5' || status=='11' || status=='15')
    {
      return 'success'
      
    }else if(status=='7' || status=='8' || status=='10' || status=='14' ||status=='16')
    {
      return 'danger'
    }else{
      return 'medium'
    }
  }
}
