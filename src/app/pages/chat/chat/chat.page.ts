import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { IonicModule, IonContent } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule]
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  
  customer1: string = '';
  customer2: string = '';
  adoptionId: string = '';
  socket!: Socket;
  messages: any[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  // New properties for additional details
  adoptionImage: string = '';
  petName: string = '';
  receiverName: string = '';
  senderName: string = '';
  userName: string = '';

  private loadChatUrl = 'https://petba.in/Api/api/index.php/loadChat';
  private saveMessageUrl = 'https://petba.in/Api/api/index.php/saveMessage';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.customer1 = userData.userData?.customer_id || 'NA';

    // Get navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state;
      this.adoptionImage = state['adoption_image'] || '';
      this.petName = state['petname'] || '';
      this.receiverName = state['receiver_name'] || '';
      this.senderName = state['sender_name'] || '';
      this.userName = state['firstname'] || '';
    }

    // Initialize socket connection with unique identifier
    this.socket = io('http://localhost:5000', {
      query: { clientId: this.customer1 }
    });

    this.route.paramMap.subscribe(params => {
      const receiverId = params.get('receiver_id') || '';
      const senderId = params.get('sender_id') || '';
      this.adoptionId = params.get('adoption_id') || '';

      console.log('senderId:', senderId);
      console.log('receiverId:', receiverId);
      console.log('chatlist Pet:', this.petName);
      console.log('chatlist Reciever:', this.receiverName);
      console.log('chatlist Sender:', this.senderName);
      console.log('chatlist userName:', this.userName);


      this.customer2 = this.customer1 === receiverId ? senderId : receiverId;

      this.joinRoom();
      this.loadChatHistoryAsync();
    });

    // Listen for incoming messages
    this.socket.on('chat message', (data: { 
      customer1: string, 
      customer2: string, 
      adoptionId: string, 
      message: string, 
      messageId: string 
    }) => {
      // Verify the message is for this specific conversation
      const isForThisConversation = 
        (data.customer1 === this.customer2 && data.customer2 === this.customer1 && data.adoptionId === this.adoptionId);

      // Check for duplicates
      const isDuplicate = this.messages.some(msg => 
        msg.messageId === data.messageId
      );

      if (isForThisConversation && !isDuplicate) {
        const newMessage = {
          ...data,
          time: new Date().toISOString(),
          isCurrentUserSender: false,
          messageId: data.messageId
        };

        this.messages.push(newMessage);
        
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  joinRoom() {
    const sortedCustomers = [this.customer1, this.customer2].sort();
    const roomName = `${sortedCustomers[0]}-${sortedCustomers[1]}-${this.adoptionId}`;
    this.socket.emit('join room', {
      customer1: this.customer1,
      customer2: this.customer2,
      adoptionId: this.adoptionId
    });
    console.log(`Joined room: ${roomName}`);
    console.log('Customer 1:', this.customer1);
    console.log('Customer 2:', this.customer2);
  }

  sendMessage() {
    const message = this.newMessage.trim();
    if (message) {
      // Generate a unique message ID
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = {
        customer1: this.customer1,
        customer2: this.customer2,
        adoptionId: this.adoptionId,
        message: message,
        messageId: messageId,
        client: this.customer1  // Unique client identifier
      };

      // Emit message with unique identifier
      this.socket.emit('chat message', messageData);
      
      // Add message to local list
      this.messages.push({
        ...messageData,
        time: new Date().toISOString(),
        isCurrentUserSender: true
      });

      this.newMessage = '';
      
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  loadChatHistoryAsync() {
    this.isLoading = true;
    const payload = {
      sender_id: parseInt(this.customer1),
      receiver_id: parseInt(this.customer2),
      adoption_id: parseInt(this.adoptionId)
    };

    this.http.post<any>(this.loadChatUrl, payload).subscribe(
      response => {
        if (response && response.chatData) {
          // Process chat history to normalize it
          this.messages = response.chatData.map((msg: any) => ({
            ...msg,
            messageId: `msg_${msg.id}`, // Add a unique identifier
            isCurrentUserSender: msg.from_id === this.customer1
          }));
          console.log('Chat history loaded:', this.messages);

          setTimeout(() => {
            this.scrollToBottom();
            this.isLoading = false;
          }, 300);
        } else {
          console.error('Invalid response format:', response);
          this.isLoading = false;
        }
      },
      error => {
        console.error('Error loading chat history:', error);
        this.isLoading = false;
      }
    );
  }

  scrollToBottom() {
    if (this.content) {
      this.content.scrollToBottom(300);
    }
  }
}