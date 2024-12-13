import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ToastService } from 'src/app/services/common/toast.service';

interface User {
  userData: UserData;
}

interface params {
  userData: {
    email: string;
    token: string;
    customer_id: string;
    product_id: string;
  };
}

interface UserData {
  customer_id: string;
  firstname: string;
  lastname: string;
  email: string;
  token: string;
}

export class Constants {
  public static currency = 'INR';
  public static wishListButtonText = 'Add to wishlist';
  public static wishListAddSuccessButtonText = 'Added to wishlist';
  public static addToCartButtonText = 'Add to cart';
  public static addToCartSuccessButtonText = 'Added to cart';
  public static topCategory = 'Top Category';
  public static ReccomandForYou = 'Recommended For You';
}
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage {
  More: boolean = false;
  ProductLoading: boolean = true;
  // img=[
  //   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   ,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   ,'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   ,'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   ,'https://rukminim2.flixcart.com/image/416/416/l1ch4sw0/pet-food/n/m/l/-original-imagcxmtbfzyxbju.jpeg?q=70&crop=false'
  //   // ,''
  //   ,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  // ]
  img: string[] = [];
  params: params = {
    userData: {
      product_id: '',
      customer_id: '',
      email: '',
      token: '',
    },
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  constants = Constants;
  productImage: string[] = []; // product images
  //  productid!:string;//it store the product id frpme previous page
  proDetails: any = {}; //it will store all details relrated to  current product
  features: any[] = []; //to store the features of products
  relatedpro: any[] = []; // to store relate products
  price: any; //special prices price or original  price either 1 will be stored ovr here
  oldpri: any; // if special price is available then original price will be stored here
  save: any; //stores save percentage  from special price
  stock: any = [];
  qty_sele: any = 1; //stock stores qty frm qtyloop function, and qty_sele is the selected qty by user
  cartAdding: any; //takeing response from server if product is added to cart or not
  wishAdding: any;
  cartTotal: number = 0; //store the count of product available in cart
  delivery: any = 500; //delivery charges

  freeDiOr: boolean = false;
  freeD: boolean = false;
  deliv: boolean = false;
  In: boolean = false;
  Out: boolean = false;
  wishListButtonText = this.constants.wishListButtonText;
  addToCartButtonText = this.constants.addToCartButtonText;
  alreadyAddedToCart: boolean = false;
  alreadyAddedToWishlist: boolean = false;
  s: any;
  imgUrl2: string;
  keyword: any;
  id: any;
  constructor(
    private authService: AuthServiceService,
    private router: ActivatedRoute,
    private toastCntrl: ToastService
  ) {
    let user: UserData = JSON.parse(localStorage.getItem('userData')!).userData;
    this.params.userData.customer_id = user.customer_id;
    this.params.userData.token = user.token;
    this.params.userData.email = user.email;
    this.params.userData.product_id =
      router.snapshot.paramMap.get('product-id')!;
    // this.productid=router.snapshot.paramMap.get('product-id')!;
    this.imgUrl2 = this.authService.img2();
  }

  // selectedQuantity(e:any)
  // {

  //   this.qty_sele=e.detail.value;
  //     // console.log('ionChange fired with value: ' + e.detail.value);
  //     console.log('QUANTITY selected : ' + e.detail.value);

  // }
  addQuantity() {
    if (this.qty_sele < this.stock - 1) {
      this.qty_sele++;
    }
  }
  removeQuantity() {
    if (this.qty_sele > 1) {
      this.qty_sele--;
    }
  }

  ionViewWillEnter() {
    this.getProductInfo();
  }

  getProductInfo() {
    this.alreadyAddedToWishlist = false;
    this.alreadyAddedToCart = false;
    this.ProductLoading = true;
    this.authService
      .postData(this.params, 'productDetails')
      .then((result: any) => {
        // DELIVERY
        this.freeD = true;
        if (result.keyword) {
          this.keyword = result.keyword;
          console.log('keywords');
          console.log(this.keyword);
        }
        if (result.total) {
          this.cartTotal = result.total.total;
          console.log('cartotal');
          console.log(this.cartTotal);
        }

        if (result.proDetails) {
          this.proDetails = result.proDetails;
          console.log('Product details');
          console.log(this.proDetails);
          // this.stock=this.qtyloop(this.proDetails.quantity);
          // this.qty_sele=this.stock[0];
          this.stock = this.proDetails.quantity;
          this.qty_sele = this.stock < 1 ? 0 : 1;
          //to check if special price iz der or not
          if (this.proDetails.specialprice != null) {
            this.price = this.proDetails.specialprice; //discounted price
            this.oldpri = this.proDetails.price; //old price
            this.save = (
              100 -
              (JSON.parse(this.price) / JSON.parse(this.oldpri)) * 100
            ).toFixed(2);
          } else {
            this.price = this.proDetails.price;
          }
          //to push image from product table
          this.productImage.push(this.imgUrl2 + this.proDetails.image);
          //this.domSanitizer.bypassSecurityTrustUrl(this.productImage);
        }
        //for product images
        if (result.img.length > 0) {
          let a = result.img;

          for (let img of a) {
            this.productImage.push(this.imgUrl2 + img.image);
          }
          // if(c!==1){
          //   this.loopImg='true';
          // }
        }
        //poduct attributes
        if (result.attribute.length > 0) {
          this.features = result.attribute;
        }
        //related productss
        if (result.relatedpro.length > 0) {
          this.relatedpro = result.relatedpro;
          //  if(result.relatedpro.length > 2){
          //  this.loop = "true";
          // }
        }
        //Check if added to card
        if (result.cart > 0) {
          this.addToCartButtonText = this.constants.addToCartSuccessButtonText;
          this.alreadyAddedToCart = true;
        }
        //Check if added to card
        if (result.wishList > 0) {
          this.alreadyAddedToWishlist = true;
          this.wishListButtonText = this.constants.wishListAddSuccessButtonText;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.ProductLoading = false;
      });
  }
  qtyloop(qty: number) {
    //select qty loop array
    var total;
    var r = [];
    if (qty > 0 && qty < 5) {
      for (var _i = 1; _i <= qty; _i++) {
        r.push(_i);
      }
    } else if (qty > 5) {
      for (var _u = 1; _u <= 5; _u++) {
        r.push(_u);
      }
    }
    total = r;
    return total;
  }

  addToCart() {
    // this.alreadyAddedToCart=true;
    if (this.alreadyAddedToCart == false) {
      let addToCartParams: params & { userData: { qty: string } } = {
        userData: {
          customer_id: this.params.userData.customer_id,
          email: this.params.userData.email,
          product_id: this.params.userData.product_id,
          token: this.params.userData.token,
          qty: this.qty_sele,
        },
      };

      if (addToCartParams.userData.qty && addToCartParams.userData.product_id) {
        this.authService
          .postData(addToCartParams, 'addcart')
          .then((result) => {
            this.cartAdding = result;
            console.log("cart test", this.cartAdding);
            if (this.cartAdding.added) {
              var added = this.cartAdding.added;
              console.log(added);
              this.alreadyAddedToCart = true;
              this.toastCntrl.presentToast(
                'Added to Cart',
                'dark',
                1500,
                'bottom'
              );
              console.log("Porduct Added to Cart")
            }
            if (this.cartAdding.total) {
              this.cartTotal = this.cartAdding.total.total;
              console.log(this.cartTotal);
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {});
        this.addToCartButtonText = this.constants.addToCartSuccessButtonText;
      }
    } else {
      this.toastCntrl.presentToast(
        'Already added to Cart',
        'dark',
        1500,
        'bottom'
      );
    }
  }

  addToWishList() {
    if (this.alreadyAddedToWishlist == false) {
      if (this.params.userData.product_id) {
        this.authService
          .postData(this.params, 'makewish')
          .then((result) => {
            this.wishAdding = result;
            console.log(this.wishAdding);
            if (this.wishAdding.added) {
              var added = this.wishAdding.added;
              console.log(added);
              this.toastCntrl.presentToast(
                '<b>Added to Wishlist</b>',
                'dark',
                1500,
                'bottom'
              );

              this.alreadyAddedToWishlist = true;
            } else {
              //this.presentToast("Please give valid username and password");
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {});
        this.wishListButtonText = this.constants.wishListAddSuccessButtonText;
      }
    } else {
      this.toastCntrl.presentToast(
        '<b>Already added to wishlist</b>',
        'dark',
        1500,
        'bottom'
      );
    }
  }
  share() {
    throw new Error('Method not implemented.');
  }
}
