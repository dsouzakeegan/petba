import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface searchResults {
  brand: string;
  category: string;
  description: string;
  discount: string;
  image: string;
  model: string;
  name: string;
  price: string;
  product_id: string;
  quantity: string;
  specialprice: string | null;
}
export interface ListData{
  id:string,
  name:string,
  category:string,
  image:string
}

@Component({
  selector: 'app-search-productpage',
  templateUrl: './search-productpage.page.html',
  styleUrls: ['./search-productpage.page.scss'],
})
export class SearchProductpagePage implements OnInit {
  UserText:string|null="Search for products"
  isSearching:boolean =false;
  UserData:User;
  ImageUrlPrefix:string;
  public results:ListData[] = [];
  constructor(
    private authService :AuthServiceService
  ) { 
    this.UserData = JSON.parse(localStorage.getItem('userData')!)
    this.ImageUrlPrefix =authService.img2();
  }

  ngOnInit() {
  }

  SearchProduct(ev: Event) {
    if (ev && ev.target && 'value' in ev.target && ev.target.value) {
      let q: string = (ev.target as HTMLInputElement).value.trim();

      // Check if the trimmed value is not an empty string
      if (q !== '') {
    const query = q.toLowerCase();
    this.getResultProducts(query);

      }else{
        this.UserText="Search for products";
      }
    } else {
      // console.error('Event or target is null or undefined.');
      this.UserText = "Search for products";
    }
  }

  async getResultProducts(query:string){
    this.isSearching =true;
    try{
      if(this.UserData)
        {
          const Params = {
            userData:{
              ...this.UserData.userData,
              lastCreated : '0',
              search:query
            }
          }
           this.authService.postData(Params,'searchitems')
      .then((res:any)=>{
        console.log(res);
        if(res.searchitems.length > 0)
          {
            this.results = this.MapResults(res.searchitems);
            this.UserText =null;
          }else{
            // no results found
            console.log("no results");
            this.results =[]
            this.UserText = `No results for <strong>${query}<strong />`
            
          }
        
      })
      .catch(error=>console.error(error))
      .finally(()=>{})
        }else{
          console.error('User Not Logged In....'); 
          this.UserText="Login Required..." 
        }
    }catch(e)
    {
      console.error(e);
      this.UserText ="Something wend wrong.."
      
    }finally{
      this.isSearching=false;
    }
   
  }
  MapResults(data:searchResults[]) :ListData[] 
  {
    
      if(data.length > 0 )
        {
        const mappedData =  data.map((ele)=>{
            let a:ListData= {
              id:ele.product_id,
              image:this.ImageUrlPrefix+ele.image,
              name:ele.name,
              category:ele.category
            }
            return a;
          })
          return mappedData;
        }else{
          return [];
        }
    
  }

  
}
