import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  message: string;
  sender_id: string;
  receiver_id: string;
  from_id: string;
  status: string;
  date_time: string;
}

interface ChatResponse {
  chatData: ChatMessage[];
}

interface ChatDetails {
  adoption_id: string;
  sender_id: string;
  receiver_id: string;
  adoption_image: string;
  petname: string;
  receiver_name: string;
  sender_name: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ChatPage implements OnInit {
  socket: any;
  serverUrl: string = 'http://localhost:5000';
  customer1: string = '';
  customer2: string = '';
  adoptionId: string = '';
  room: string = '';
  message: string = '';
  messages: string[] = [];
  chatHistory: ChatMessage[] = [];
  apiUrl: string = 'https://petba.in/Api/api/index.php/loadChat';
  customer_id: string = '';
  adoptionImage: string = '';
  petName: string = '';
  chatName: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.customer_id = userData.userData?.customer_id || '';

    this.socket = io(this.serverUrl);
    this.socket.on('chat message', (msg: string) => {
      this.messages.push(msg);
      console.log('Socket message received');
      
      // Refresh chat history when receiving a socket message
      this.loadChatHistory();
    });

    this.route.paramMap.subscribe(params => {
      this.customer1 = params.get('sender_id')|| '';
      this.customer2 = params.get('receiver_id') || '';
      this.adoptionId = params.get('adoption_id') || '';
      this.joinRoom();
      this.loadChatHistory();
      this.loadChatDetails();
    });
    console.log('Current customer_id from localStorage:', this.customer_id);
  }

  loadChatHistory() {
    if (this.customer1 && this.customer2 && this.adoptionId) {
      const payload = {
        sender_id: parseInt(this.customer1),
        receiver_id: parseInt(this.customer2),
        adoption_id: parseInt(this.adoptionId)
      };

      this.http.post<ChatResponse>(this.apiUrl, payload).subscribe(
        response => {
          this.chatHistory = response.chatData;
          
          // Log each message to console for verification
          this.chatHistory.forEach(chat => {
            // console.log('Message from API:', chat.message);
          });
          
          console.log('Chat history loaded:', this.chatHistory);
        },
        error => {
          console.error('Error loading chat history:', error);
        }
      );
    }
  }

  joinRoom() {
    if (this.customer1 && this.customer2 && this.adoptionId) {
      console.log('room joined ');
      this.socket.emit('join room', {
        customer1: this.customer1,
        customer2: this.customer2,
        adoptionId: this.adoptionId
      });
        console.log('cus1', this.customer1, this.customer2, this.adoptionId);

    }
  }

  sendMessage() {
    console.log('message send ');
    console.log('cus11', this.customer1, this.customer2, this.adoptionId);

    if (this.message.trim() && this.customer1 && this.customer2 && this.adoptionId) {
      this.socket.emit('chat message', {
        customer1: this.customer1,
        customer2: this.customer2,
        adoptionId: this.adoptionId,
        message: this.message
      });
      this.message = '';
      
      // Add a small delay before refreshing chat history to allow the message to be saved
      setTimeout(() => {
        this.loadChatHistory();
      }, 100);
    }
  }

  loadChatDetails() {
    const apiUrl = 'https://petba.in/Api/api/index.php/chatlist';
    const payload = {
      c_id: this.customer_id
    };

    this.http.post<any>(apiUrl, payload).subscribe(
      response => {
        if (response && response.chatlist) {
            const chatDetails: ChatDetails | undefined = response.chatlist.find((chat: ChatDetails) => 
            chat.adoption_id === this.adoptionId && 
            (chat.sender_id === this.customer1 || chat.receiver_id === this.customer1)
            );

          if (chatDetails) {
            this.adoptionImage = chatDetails.adoption_image;
            this.petName = chatDetails.petname;
            this.chatName = chatDetails.receiver_name === this.customer_id ? chatDetails.sender_name : chatDetails.receiver_name;

            // Log the values to the console
            console.log('Adoption Image:', this.adoptionImage);
            console.log('Pet Name:', this.petName);
            console.log('Chat Name:', this.chatName);
          } else {
            console.error('Chat details not found for the given adoption ID and customer ID');
          }
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error => {
        console.error('Error loading chat details:', error);
      }
    );
  }
}