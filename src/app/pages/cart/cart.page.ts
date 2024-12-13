import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service'; // Import your AuthService
import { NavController, ToastController } from '@ionic/angular';
import { AlertServiceService } from 'src/app/services/alert-service.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  counter: number = 1;
  Loading: boolean = true;
  products: any[] = [];
  responseData: any;
  userData: any;
  imgUrl2: any;
  cartPro: any;
  noCartdata = false;
  delvery: any;
  deleteres: any;
  orderSummaryModalState: boolean=true;

  


  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCntrl: AlertServiceService,
  ) {  
    this.imgUrl2 = this.authService.img2();
  }

  ngOnInit() {    
    this.getCartProducts();
  }


  
   
  getCartProducts() {  
    this.userData = JSON.parse(localStorage.getItem("userData")!);  
    this.authService.postData(this.userData, "cartProducts").then((result) => {
      this.responseData = result;
      console.log("Cart Products: ", this.responseData);
      
      if (this.responseData.cartProducts) {
        this.cartPro = this.responseData.cartProducts;
      
        let processedProducts = [];
        for (let pro of this.responseData.cartProducts) {
          let price;
          let oririnalPrice;
          let off;

          
          if (pro.specialprice != null) {
            price = pro.specialprice;
            oririnalPrice = pro.price;
            let pri = JSON.parse(price);
            let oriprice = JSON.parse(oririnalPrice);
            off = 100 - ((pri / oriprice) * 100);
          } else {
            price = pro.price;
          }
         
          let processedProduct = {
            c_id: pro.cart_id,
            p_id: pro.product_id,
            name: pro.name,
            price: JSON.parse(price),
            category: pro.category,
            oririnalPrice: oririnalPrice,
            off: off,
            model: pro.model,
            quantity: JSON.parse(pro.cart_qty),
            totalqty: JSON.parse(pro.quantity),
            imgUrl: pro.image,
            brand: pro.brand,
            specialprice: pro.specialprice,
          };
          processedProducts.push(processedProduct);
        }       
        this.products = processedProducts;
        console.log("Processed Products: ", this.products);        
        this.noCartdata = false;
      } else {
      
        this.noCartdata = true;
      }      
      this.Loading = false;
    }).catch((err) => {
      console.log("Error fetching cart products: ", err);      
      this.Loading = false;
    });
  }

  
  quantity(action: 'add' | 'remove') {
    if (action === 'add' && this.counter < 99) {
      this.counter++;
    } else if (action === 'remove') {
      if (this.counter > 1) {
        this.counter--;
      }
    }
  }

 
  removeItem_fromCart(item: any) {   
    let userData = JSON.parse(localStorage.getItem("userData")!);
    userData.userData.c_id = item.c_id;
    this.authService.postData(userData, "deletecartitem").then((result) => {
      this.deleteres = result;
      console.log("Delete Response: ", this.deleteres); 
      if (this.deleteres.delet) {
        var deleted = this.deleteres.delet;
        console.log("Deleted Item: ", deleted);
        this.presentToast(deleted);
      }
    }).catch((err) => {
      console.log("Error removing item from cart: ", err);
    });
    this.products.splice(this.products.indexOf(item), 1);
    if (this.products.length == 0) {
      this.noCartdata = true;
    }
  }

  presentConfirmationAlert(product:any)
  {
    let  buttonOptions = [
      {
        text: 'cancel',
        role: 'cancel',
        cssClass:'button-text-capitalize',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'remove',
        cssClass:'remove-button button-text-capitalize',
        role: 'confirm',
        handler: () => {
          console.log('Alert confirmed');
          this.removeItem_fromCart(product);
        },
      },
    ];
    this.alertCntrl.present("",buttonOptions,"Remove this product from your cart?");
  }
  getSubtotal() {
    let total = 0;
    if (this.products) {
      this.products.forEach(function (item) {
        total += parseInt(item.price) * item.quantity;
      });
    }
    return total;
  }

  delivery() {
    if (this.getSubtotal() <= 500) {
      this.delvery = 0;
    } else {
      this.delvery = 0; // Assuming no delivery charge for orders above 500
    }
    return this.delvery;
  }

  async goToCheckout() {   
    this.viewSummary(false);

    
    let ptotal = this.getSubtotal() + this.delivery();
    let userData = JSON.parse(localStorage.getItem("userData")!);
    userData.total = ptotal;
    let productSummary = this.generateProductSummary();
    setTimeout(()=>{
      this.router.navigate(['/address'], { 
        queryParams: { 
          productSummary: JSON.stringify(productSummary) // Stringify productSummary before passing
        } 
      });
    },500)

}

viewSummary(state:boolean){
  this.orderSummaryModalState=state;
}

generateProductSummary(): any {
  let productImages: string[] = [];
  for (let item of this.products) {  
    productImages.push(this.imgUrl2 + item.imgUrl);
  }
  
  let summary: { name: string, quantity: number }[] = [];
  let quantity = this.quantity;
  
  this.products.forEach((product) => {
    let productSummary = {
      name: product.name,
      quantity: product.quantity
    };
    summary.push(productSummary);
  });  
  
  const productSummary: any = {
    summary: summary,
    quantity: quantity,
    subtotal: this.getSubtotal(),
    images: productImages
  };
  console.log("Product Summary JSON:", productSummary);
  
  return productSummary;
}


// generateProductSummary(): any {  
//   let summary = '';
//   let quantity = this.quantity;

//   this.products.forEach((product, index) => {
//     summary += `${product.name} x ${product.quantity}`;
//     if (index < this.products.length - 1) {
//       summary += '   +   ';
//     }
//   });  
  
  
//   const productSummary: any = {
//       summary: summary,
//       quantity: quantity,
//       subtotal: this.getSubtotal()
//   };
//   console.log("Product Summary:", productSummary);

//   return productSummary;
// }


  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  item = {
    quantity: 1, 
    totalqty: 10 
  };

 
decrementQuantity(item: any) {
  if (item.quantity > 1) {
    item.quantity--;
  }else{
    this.presentConfirmationAlert(item);
  }
}

incrementQuantity(item: any) {
  if (item.quantity < 10) {
    item.quantity++;
  }
}

}






































