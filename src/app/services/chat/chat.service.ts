import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;
  serverUrl: string = window.location.protocol === 'https:' ? 'wss://localhost:3000' : 'ws://localhost:3000';
  currentUserId: string | null = null;
  chatRoomsSubject = new BehaviorSubject<any[]>([]);
  selectedChatRoomMessagesSubject = new BehaviorSubject<any[]>([]);
  notificationSubject = new BehaviorSubject<any>(null);

  // Notifications array to store the notifications in memory
  private inboxNotifications: any[] = [];

  constructor() {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        this.currentUserId = parsedUserData?.userData?.customer_id || null;
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        this.currentUserId = null;
      }
    } else {
      console.warn('userData not found in localStorage');
      this.currentUserId = null; // Handle missing user data appropriately
    }

    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      this.socket = io(this.serverUrl, {
        transports: ['polling'], // Specify transports
        reconnectionAttempts: 5, // Number of reconnection attempts
        reconnectionDelay: 1000, // Delay between reconnection attempts
      });

      this.socket.on('connect', () => {
        console.log('Connected to the server');
      });

      this.socket.on('disconnect', () => {
        console.warn('Disconnected from the server');
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
      });

      this.socket.on('updateChatRooms', (chatRooms: any[]) => {
        this.chatRoomsSubject.next(chatRooms);
      });

      this.socket.on('updateMessages', (messages: any[]) => {
        this.selectedChatRoomMessagesSubject.next(messages);
      });

      this.socket.on('newMessage', (message: any) => {
        if (message.senderId !== this.currentUserId) {
          this.handleIncomingMessage(message);
          this.markAllMessagesAsRead(message.chatRoomId);
        }
        this.notificationSubject.next(message);

        // Add the received message to inbox notifications
        this.addNotificationToInbox(message);
      });

      this.socket.on('messageRead', ({ messageId }) => {
        const messages = this.selectedChatRoomMessagesSubject.getValue();
        const messageIndex = messages.findIndex((msg) => msg.id === messageId);
        if (messageIndex !== -1) {
          messages[messageIndex].seen = true;
          this.selectedChatRoomMessagesSubject.next([...messages]);
        }
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  // Store incoming messages as notifications
  private addNotificationToInbox(notification: any) {
    // Check if the senderId of the notification is different from the currentUserId
    if (notification.senderId !== this.currentUserId) {
      const notificationData = {
        senderId: notification.senderId,
        senderName: notification.senderName,
        message: notification.message,
        timestamp: new Date(),
      };

      this.inboxNotifications.push(notificationData);
    }
  }

  // Get all stored notifications (used for Inbox page)
  getStoredNotifications(): any[] {
    return this.inboxNotifications;
  }

  joinRoom(chatRoomId: string) {
    if (this.currentUserId) {
      console.log('Current UserId: ', this.currentUserId);
      this.socket.emit('joinRoom', { userId: this.currentUserId, chatRoomId });
    } else {
      console.error('Cannot join room: currentUserId is null');
    }
  }

  sendMessage(
    chatRoomId: string,
    message: {
      id: string;
      senderId: string;
      message: string;
      time: string;
      seen: boolean;
      type: string;
      img?: string;
    }
  ) {
    if (this.currentUserId) {
      this.socket.emit('sendMessage', { chatRoomId, message });
    } else {
      console.error('Cannot send message: currentUserId is null');
    }
  }

  sendImageMessage(chatRoomId: string, imageData: string) {
    if (this.currentUserId) {
      const message = {
        id: Date.now().toString(), // Generate a unique ID for the message
        senderId: this.currentUserId,
        message: '',
        time: new Date().toISOString(),
        seen: false,
        type: 'img',
        img: imageData,
      };
      this.sendMessage(chatRoomId, message);
    } else {
      console.error('Cannot send image message: currentUserId is null');
    }
  }

  getChatRooms() {
    if (this.currentUserId) {
      this.socket.emit('getChatRooms', this.currentUserId);
    } else {
      console.error('Cannot get chat rooms: currentUserId is null');
    }
  }

  getChatRoomMessages(chatRoomId: string) {
    if (this.currentUserId) {
      this.socket.emit('getChatRoomMessages', chatRoomId);
    } else {
      console.error('Cannot get chat room messages: currentUserId is null');
    }
  }

  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message: any) => {
        observer.next(message);
      });
    });
  }

  sendTypingStatus(chatRoomId: string, isTyping: boolean) {
    if (this.currentUserId) {
      this.socket.emit('typing', { chatRoomId, isTyping });
    } else {
      console.error('Cannot send typing status: currentUserId is null');
    }
  }

  sendStopTypingStatus(chatRoomId: string) {
    if (this.currentUserId) {
      this.socket.emit('stopTyping', { chatRoomId });
    } else {
      console.error('Cannot send stop typing status: currentUserId is null');
    }
  }

  onTyping(): Observable<{
    room: { userId: string; isTyping: boolean };
    chatRoomId: any;
    userId: string;
    isTyping: boolean;
  }> {
    return new Observable((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
    });
  }

  markAllMessagesAsRead(chatRoomId: string) {
    const messages = this.selectedChatRoomMessagesSubject.getValue();
    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== this.currentUserId && !msg.seen
    );

    unreadMessages.forEach((message) => {
      this.socket.emit('messageRead', {
        chatRoomId,
        messageId: message.id,
        userId: this.currentUserId,
      });
    });
  }

  get chatRooms(): Observable<any[]> {
    return this.chatRoomsSubject.asObservable();
  }

  get selectedChatRoomMessages(): Observable<any[]> {
    return this.selectedChatRoomMessagesSubject.asObservable();
  }

  onNotification(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  createChatRoom(
    owner_id: string,
    adopter_id: string,
    pet_id: string,
    petName: string,
    ownerName: string,
    img: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.currentUserId) {
        console.log('Creating chat room with data:', { owner_id, adopter_id, pet_id, petName, ownerName, img });
        this.socket.emit(
          'createChatRoom',
          { owner_id, adopter_id, pet_id, petName, ownerName, img },
          (response: any) => {
            if (response.error) {
              console.error('Error creating chat room:', response.error);
              reject(response.error);
            } else {
              console.log('Chat room created successfully:', response.room);
              resolve(response.room);
              this.getChatRooms();
            }
          }
        );
      } else {
        console.error('Cannot create chat room: currentUserId is null');
        reject('Cannot create chat room: currentUserId is null');
      }
    });
  }

  private handleIncomingMessage(message: any) {
    this.showNotification(message);
  }

  private async showNotification(message: any) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'New Message',
          body: message.message,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 1000) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  }
}