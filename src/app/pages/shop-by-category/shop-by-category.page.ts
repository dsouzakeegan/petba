import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { pageProductType } from 'src/app/interfaces/pageType';
import { AuthServiceService } from 'src/app/services/auth-service.service';
interface category {
  c_id: string;
  c_name: string;
  parent_id: string;
  sort: string;
}
interface NewCategory {
  c_id: string;
  c_name: string;
  parent_id: string;
  sort: string;
  categoryOptions:NewCategory[];
}



@Component({
  selector: 'app-shop-by-category',
  templateUrl: './shop-by-category.page.html',
  styleUrls: ['./shop-by-category.page.scss'],
})
export class ShopByCategoryPage implements OnInit {
  pageType:pageProductType=pageProductType.shop_by_category;
  category:NewCategory[]=[]
  categoryMap=new Map();
  User: User;
  constructor(
    private authService : AuthServiceService
  ) {
    this.User = JSON.parse(localStorage.getItem('userData')!);
   }

  ngOnInit() {
    this.getCategory();
  }

 async getCategory()
  {
  
  await this.authService.postData(this.User,'category').then((result:any)=>{
    if(result.category.length > 0)
    {

    let resultCategory:category[]=result.category;
    
    // CREATING THE STRUCTURE


    resultCategory.forEach((category:category) => {
      const parentId = category.parent_id;
      if (!this.categoryMap.has(parentId)) {
        this.categoryMap.set(parentId, []);
      }
      this.categoryMap.get(parentId).push(category);
    });
    this.category=this.buildCategoryHierarchy('0')
    // console.log(this.categoryMap);
    // console.log(this.category)
  }else{
    console.error("No categories found");
  }

  }).catch((error)=>{console.log(error)}).finally(()=>{})
}
   buildCategoryHierarchy(parentId:string):NewCategory[] {
    const categories:category[] = this.categoryMap.get(parentId) || [];
    return categories.map((category:category) => ({
      ...category,
      categoryOptions: this.buildCategoryHierarchy(category.c_id)
    }));
  }
  
}
