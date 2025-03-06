import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChatListPage } from './pages/chat/chat-list/chat-list.page';
import { ChatPage } from './pages/chat/chat/chat.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  //new route for chat-list
  {
    path: '',
    redirectTo: '/chat-list',
    pathMatch: 'full',
  },
  {
    path: 'chat-list',
    component: ChatListPage,
  },
  {
    path: 'chat/:sender_id/:receiver_id/:adoption_id',
    component: ChatPage,
  },
  //new route for chat-list

  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./components/camera/camera-routing.module').then( m => m.CameraRoutingModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'send-otp',
    loadChildren: () => import('./pages/phoneVerification/send-otp/send-otp.module').then( m => m.SendOtpPageModule)
  },
  {
    path: 'verify-otp',
    loadChildren: () => import('./pages/phoneVerification/verify-otp/verify-otp.module').then( m => m.VerifyOtpPageModule)
  },
  {
    path: 'search-productpage',
    loadChildren: () => import('./pages/search-productpage/search-productpage.module').then( m => m.SearchProductpagePageModule)
  },
  {
    path: 'chat-list',
    loadChildren: () => import('./pages/chat/chat-list/chat-list.module').then( m => m.ChatListPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'products/:type',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'product-detail/:product-id',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then( m => m.ProductDetailPageModule)
  },
  {
    path: 'chat/:roomId/:petId',
    loadChildren: () => import('./pages/chat/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'list/:type',
    loadChildren: () => import('./pages/Services/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'blogs',
    loadChildren: () => import('./pages/Blog/blogs/blogs.module').then( m => m.BlogsPageModule)
  },
  {
    path: 'blog/:blog-id',
    loadChildren: () => import('./pages/Blog/blog/blog.module').then( m => m.BlogPageModule)
  },
  {
    path: 'rescues',
    loadChildren: () => import('./pages/Services/rescues/rescues.module').then( m => m.RescuesPageModule)
  },
  {
    path: 'my-pets',
    loadChildren: () => import('./pages/my-pets/my-pets.module').then( m => m.MyPetsPageModule)
  },
  {
    path: 'pet-details/:owner-id/:pet-id',
    loadChildren: () => import('./pages/pet-details/pet-details.module').then( m => m.PetDetailsPageModule)
  },
  {
    path: 'list-details/:type/:id',
    loadChildren: () => import('./pages/Services/list-details/list-details.module').then( m => m.ListDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/Profile/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'rescue/:rescue-id',
    loadChildren: () => import('./pages/Services/rescue/rescue.module').then( m => m.RescuePageModule)
  },
  {
    path: 's-filter',
    loadChildren: () => import('./pages/Services/s-filter/s-filter.module').then( m => m.SFilterPageModule)
  },
  {
    path: 'p-filter',
    loadChildren: () => import('./pages/Services/p-filter/p-filter.module').then( m => m.PFilterPageModule)
  },
  {
    path: 'pet',
    loadChildren: () => import('./pages/Add/pet/pet.module').then( m => m.PetPageModule)
  },
  {
    path: 'rescuepet',
    loadChildren: () => import('./pages/Add/rescuepet/rescuepet.module').then( m => m.RescuepetPageModule)
  },
  {
    path: 'image-view',
    loadChildren: () => import('./pages/image-view/image-view.module').then( m => m.ImageViewPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'adoption',
    loadChildren: () => import('./pages/Services/adoption/adoption.module').then( m => m.AdoptionPageModule)
  },
  {
    path: 'write-review',
    loadChildren: () => import('./pages/Services/write-review/write-review.module').then( m => m.WriteReviewPageModule)
  },
  {
    path: 'shop-by-category',
    loadChildren: () => import('./pages/shop-by-category/shop-by-category.module').then( m => m.ShopByCategoryPageModule)
  },
  {
    path: 'product-wishlist',
    loadChildren: () => import('./pages/product-wishlist/product-wishlist.module').then( m => m.ProductWishlistPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./pages/new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./pages/my-orders/my-orders.module').then( m => m.MyOrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'my-donations',
    loadChildren: () => import('./pages/my-donations/my-donations.module').then( m => m.MyDonationsPageModule)
  },
  {
    path: 'all-services',
    loadChildren: () => import('./pages/Services/all-services/all-services.module').then( m => m.AllServicesPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./pages/address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'edit-mypet',
    loadChildren: () => import('./pages/edit-mypet/edit-mypet.module').then( m => m.EditMypetPageModule)
  },
  {
    path: 'edit-rescue',
    loadChildren: () => import('./pages/edit-rescue/edit-rescue.module').then( m => m.EditRescuePageModule)
  },
  {
    path: 'donation',
    loadChildren: () => import('./pages/donation/donation.module').then( m => m.DonationPageModule)
  },
  {
    path: 'personaldetails',
    loadChildren: () => import('./pages/personaldetails/personaldetails.module').then( m => m.PersonaldetailsPageModule)
  },
  {
    path: 'inbox', // Add this route for the inbox
    loadChildren: () => import('src/app/folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: '**', // PAGE NOT FOUND PATH (Needs to be the last of all routes)
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}