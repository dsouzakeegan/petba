//code to fetch customer_id from local storage

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
  standalone: true,
  imports: [IonicModule, HttpClientModule, CommonModule]
})
export class ChatListPage implements OnInit {
  chatRooms: any[] = [];
  Loading: boolean = true; 
  customer_id!: string;
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  token: string = '';
  apiUrl = 'https://petba.in/Api/api/index.php/chatlist';

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.customer_id = userData.userData.customer_id;
    this.firstname = userData.userData.firstname;
    this.lastname = userData.userData.lastname;
    this.email = userData.userData.email;
    this.token = userData.userData.token;
    // this.getChatLists(137);
    this.getChatLists(this.customer_id); // Replace '48' with the actual customer ID

    console.log('User Data in local storage from chat page', userData);
  }

  getChatLists(customerId: string) {
    const data = { c_id: customerId };
    this.http.post<any>(this.apiUrl, data).subscribe(
      response => {
        if (response) {
          if (response.fri === 'No Friends found') {
            console.log('No chats found');
            this.chatRooms = [];
            this.Loading = false;
          } else if (response.chatlist) {
            this.chatRooms = response.chatlist;
            this.Loading = false;
          } else {
            console.error('Invalid response format:', response);
            this.Loading = false;
          }
        } else {
          console.error('No response received');
          this.Loading = false;
        }
      },
      error => {
        console.error('Error fetching chat rooms:', error);
        this.Loading = false;
      }
    );
  }

  openChat(chat: any) {
    console.log('Opening chat with ID:', chat.chat_id);
    this.navCtrl.navigateForward(['/chat', chat.sender_id, chat.receiver_id, chat.adoption_id]);
  }
}





//Code to Use the specific customer_id


// import { Component, OnInit } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { NavController } from '@ionic/angular';

// @Component({
//   selector: 'app-chat-list',
//   templateUrl: './chat-list.page.html',
//   styleUrls: ['./chat-list.page.scss'],
//   standalone: true,
//   imports: [IonicModule, HttpClientModule, CommonModule]
// })
// export class ChatListPage implements OnInit {
//   chatRooms: any[] = [];
//   Loading: boolean = true;
//   apiUrl = 'https://petba.in/Api/api/index.php/chatlist';

//   constructor(private http: HttpClient, private navCtrl: NavController) {}

//   ngOnInit() {
//     const customerId = '137'; // Use the specific customer_id
//     this.getChatLists(customerId);
//   }

//   getChatLists(customerId: string) {
//     const data = { c_id: customerId };
//     this.http.post<any>(this.apiUrl, data).subscribe(
//       response => {
//         if (response) {
//           if (response.fri === 'No Friends found') {
//             console.log('No chats found');
//             this.chatRooms = [];
//             this.Loading = false;
//           } else if (response.chatlist) {
//             this.chatRooms = response.chatlist;
//             this.Loading = false;
//           } else {
//             console.error('Invalid response format:', response);
//             this.Loading = false;
//           }
//         } else {
//           console.error('No response received');
//           this.Loading = false;
//         }
//       },
//       error => {
//         console.error('Error fetching chat rooms:', error);
//         this.Loading = false;
//       }
//     );
//   }

//   openChat(chat: any) {
//     console.log('Opening chat with ID:', chat.chat_id);
//     this.navCtrl.navigateForward(['/chat', chat.sender_id, chat.receiver_id, chat.adoption_id]);
//   }
// }
