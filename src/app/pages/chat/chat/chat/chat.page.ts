import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Share } from '@capacitor/share';  // Import for sharing content

interface Message {
  id: string;  // Unique ID for each message
  senderId: string;
  receiverId: string;
  message: string;
  type: 'message' | 'img';
  img?: string;
  time: string;
  seen: boolean;
}

interface ApiResult {
  adopt_id: string;
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
  img6: string;
  name: string;
  owner_id: string;
  owner_name: string;
  telephone: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  
  msg: Message = {
    id: '',  // Initialize with an empty ID
    senderId: '', receiverId: '', message: '', time: '', seen: false, type: 'message'
  };

  chats!: Observable<Message[]>;
  chatsList: Message[] = [];
  pet: ApiResult = {
    adopt_id: "", img1: "", img2: "", img3: "", img4: "", img5: "", img6: "", name: "", owner_id: "", owner_name: "", telephone: ""
  };
  userId!: string;
  roomId!: string;
  adoptId!: string;
  imgUrl!: string;
  petName!: string;
  ownerName!: string;
  pfp!: string;
  
  isTyping: boolean = false;
  typingUserId: string | null = null;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthServiceService,
    private chatService: ChatService,
    private camera: CameraService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId')!;
      this.adoptId = params.get('petId')!;
      this.userId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
      this.imgUrl = this.authService.img();
      
      this.initializeChat();
    });

    this.route.queryParams.subscribe(params => {
      this.petName = params['petName'];
      this.ownerName = params['ownerName'];
      this.pfp = params['img'] || 'https://ionicframework.com/docs/img/demos/avatar.svg';
    });
  }

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('userData')!).userData.customer_id;
    this.initializeChat();
    this.subscribeToTyping();
    
    if (!this.petName || !this.ownerName || !this.pfp) {
      this.getRoomInfo();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeChat() {
    this.chatService.joinRoom(this.roomId);
    this.chatService.getChatRoomMessages(this.roomId);
    this.chats = this.chatService.selectedChatRoomMessages;
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    this.chats.pipe(takeUntil(this.unsubscribe$)).subscribe((messages: Message[]) => {
      this.chatsList = messages;
      this.scrollToBottom();
    
      // Mark all received messages as read using the ChatService method
      this.chatService.markAllMessagesAsRead(this.roomId);
    });
    
    this.chatService.onNewMessage().pipe(takeUntil(this.unsubscribe$)).subscribe((message: Message) => {
      this.chatsList.push(message);
      this.scrollToBottom();
      
      // Log the received message to the console
      console.log('Received new message:', message);
  
      // Mark all received messages as read using the ChatService method
      this.chatService.markAllMessagesAsRead(this.roomId);
    });
  }  
  
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 100);
  }

  getRoomInfo() {
    const params = { petId: this.adoptId };
    console.log(params);
    
    this.authService.postData(params, 'petChatInfo').then((response: any) => {
      try {
        const result = JSON.parse(response);
        if (result.result) {
          this.pet = result.result;
          this.petName = result.result.name;
          this.ownerName = result.result.owner_name;
          this.pfp = this.imgUrl + (result.result.img1 || result.result.img2 || result.result.img3 || result.result.img4 || result.result.img5 || result.result.img6);
          
          // Display the pet chat info details
          console.log('Pet Name:', this.petName);
          console.log('Owner Name:', this.ownerName);
          console.log('Profile Picture URL:', this.pfp);
        }
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        console.error('Received response:', response);
      }
    }).catch((error) => {
      console.error('Error fetching room info:', error);
    });
  }

  async sendmsg() {
    this.msg.message = this.msg.message.trim();
    if (this.msg.message !== "") {
      this.msg.senderId = this.userId;
      this.msg.receiverId = this.getReceiverId(this.roomId);  // Set the receiverId
      this.msg.time = new Date().toISOString();
      this.msg.id = Date.now().toString();  // Generate a unique ID for the message

      try {
        await this.chatService.sendMessage(this.roomId, this.msg);
        this.msg.message = "";
        this.chatService.sendStopTypingStatus(this.roomId);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  async sendImage() {
    try {
      const { image, status } = await this.camera.addNewToGallery();
      if (status === 200) {
        const message: Message = {
          id: Date.now().toString(),
          senderId: this.userId,
          receiverId: this.getReceiverId(this.roomId),  // Set the receiverId
          message: '',
          time: new Date().toISOString(),
          seen: false,
          type: 'img',
        };
        await this.chatService.sendMessage(this.roomId, message);
      }
    } catch (error) {
      console.error('Error sending image:', error);
    }
  }

  downloadImage(imgUrl: string) {
    const filename = `downloaded-image-${Date.now()}.jpg`;
  
    fetch(imgUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error downloading the image:', error));
  }

  subscribeToTyping() {
    this.chatService.onTyping().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.typingUserId = data.userId;
      this.isTyping = data.isTyping && this.typingUserId !== this.userId;
    });
  }

  onType() {
    this.chatService.sendTypingStatus(this.roomId, true);
  }

  onStopTyping() {
    this.chatService.sendStopTypingStatus(this.roomId);
  }

  getReceiverId(chatRoomId: string): string {
    // Ensure chatRoomsSubject has been populated
    const chatRooms = this.chatService.chatRoomsSubject.getValue();
    if (!chatRooms || chatRooms.length === 0) {
      console.error('No chat rooms found for the user');
      return '';  // Handle error appropriately
    }

    const chatRoom = chatRooms.find(room => room.id === chatRoomId);
    if (chatRoom) {
      return chatRoom.owner_id === this.userId ? chatRoom.adopter_id : chatRoom.owner_id;
    }

    console.error(`Chat room with id ${chatRoomId} not found`);
    return '';  // Return an empty string or handle the case where the chat room is not found
  }

  // New method to share content
  async shareContent() {
    try {
      await Share.share({
        title: 'Check this out',
        text: 'Here is something I want to share with you.',
        url: 'https://your-share-url.com', // Optional: update the URL or remove this line
        dialogTitle: 'Share this content'
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  }
}
