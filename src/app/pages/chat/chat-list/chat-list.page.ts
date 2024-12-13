import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat/chat.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit, OnDestroy {
  Loading: boolean = true;
  chatRooms$!: Observable<any[]>;
  private unsubscribe$ = new Subject<void>();
  currentUserId: string | null = null;

  // Object to store the typing status for each chat room
  typingStatus: { [roomId: string]: boolean } = {};

  constructor(private chatService: ChatService, private navCtrl: NavController) {}

  ngOnInit() {
    this.getChatLists();
    this.currentUserId = this.chatService.currentUserId;
    this.subscribeToTypingStatus();
  }

  getChatLists() {
    this.chatService.getChatRooms(); // Fetch chat rooms from the server
    this.chatRooms$ = this.chatService.chatRooms;
    this.chatRooms$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      chatRooms => {
        this.Loading = false;
        if (chatRooms.length === 0) {
          console.log("No chat rooms found.");
        } else {
          console.log("Chat rooms loaded successfully.");
        }
      },
      error => {
        console.error('Error fetching chat rooms:', error);
        this.Loading = false; // Set loading to false even if there's an error
      }
    );
  }

  getUnreadMessagesCount(chatRoom: any): number {
    if (!chatRoom || !chatRoom.messages) {
      return 0;
    }
    return chatRoom.messages.filter(
      (msg: any) => !msg.seen && msg.senderId !== this.currentUserId
    ).length;
  }

  openChat(roomId: string, petId: string) {
    this.chatRooms$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(chatRooms => {
        const selectedRoom = chatRooms.find(room => room.id === roomId);
        if (selectedRoom) {
          this.navCtrl.navigateForward([`/chat/${roomId}/${petId}`], {
            queryParams: {
              petName: selectedRoom.petName || 'Unknown Pet',
              ownerName: selectedRoom.ownerName || 'Unknown Owner',
              img: selectedRoom.img || 'https://ionicframework.com/docs/img/demos/avatar.svg'
            }
          });
        }
      });
  }

  onImageError(item: any) {
    item.img = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  // Subscribe to typing status events
  subscribeToTypingStatus() {
    this.chatService.onTyping().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.typingStatus[data.chatRoomId] = data.isTyping && data.userId !== this.currentUserId;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
