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

  img: string[] = [];
  params: params = {
    userData: {
      product_id: '',
      customer_id: '',
      email: '',
      token: '',
    },
  };

  constants = Constants;
  productImage: string[] = [];
  proDetails: any = {};
  features: any[] = [];
  relatedpro: any[] = [];
  price: any;
  oldpri: any;
  save: any;
  stock: any = [];
  qty_sele: any = 1;
  cartAdding: any;
  wishAdding: any;
  cartTotal: number = 0;
  delivery: any = 500;

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
    const storedUserData = localStorage.getItem('userData');
  
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
  
        // Handle both structures
        const user: Partial<UserData> = parsedData.userData || parsedData;
  
        // Validate required fields
        if (user && user.customer_id && user.token && user.email) {
          this.params.userData.customer_id = user.customer_id;
          this.params.userData.token = user.token;
          this.params.userData.email = user.email;
        } else {
          console.error('Parsed userData is missing required fields:', user);
        }
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
      }
    } else {
      console.error('No userData found in localStorage');
    }
  
    // Fetch product ID from route parameters
    this.params.userData.product_id =
      this.router.snapshot.paramMap.get('product-id') || '';
    this.imgUrl2 = this.authService.img2();
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
        this.freeD = true;
        if (result.keyword) {
          this.keyword = result.keyword;
          console.log('keywords', this.keyword);
        }
        if (result.total) {
          this.cartTotal = result.total.total;
          console.log('cartotal', this.cartTotal);
        }
        if (result.proDetails) {
          this.proDetails = result.proDetails;
          console.log('Product details', this.proDetails);
          this.stock = this.proDetails.quantity;
          this.qty_sele = this.stock < 1 ? 0 : 1;
          if (this.proDetails.specialprice != null) {
            this.price = this.proDetails.specialprice;
            this.oldpri = this.proDetails.price;
            this.save = (
              100 -
              (JSON.parse(this.price) / JSON.parse(this.oldpri)) * 100
            ).toFixed(2);
          } else {
            this.price = this.proDetails.price;
          }
          this.productImage.push(this.imgUrl2 + this.proDetails.image);
        }
        if (result.img.length > 0) {
          let a = result.img;
          for (let img of a) {
            this.productImage.push(this.imgUrl2 + img.image);
          }
        }
        if (result.attribute.length > 0) {
          this.features = result.attribute;
        }
        if (result.relatedpro.length > 0) {
          this.relatedpro = result.relatedpro;
        }
        if (result.cart > 0) {
          this.addToCartButtonText = this.constants.addToCartSuccessButtonText;
          this.alreadyAddedToCart = true;
        }
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

  addToCart() {
    if (!this.alreadyAddedToCart) {
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
            if (this.cartAdding.added) {
              this.alreadyAddedToCart = true;
              this.toastCntrl.presentToast(
                'Added to Cart',
                'dark',
                1500,
                'bottom'
              );
            }
            if (this.cartAdding.total) {
              this.cartTotal = this.cartAdding.total.total;
            }
          })
          .catch((err) => {
            console.error(err);
          });
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
    if (!this.alreadyAddedToWishlist) {
      if (this.params.userData.product_id) {
        this.authService
          .postData(this.params, 'makewish')
          .then((result) => {
            this.wishAdding = result;
            if (this.wishAdding.added) {
              this.toastCntrl.presentToast(
                '<b>Added to Wishlist</b>',
                'dark',
                1500,
                'bottom'
              );
              this.alreadyAddedToWishlist = true;
            }
          })
          .catch((err) => {
            console.error(err);
          });
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
