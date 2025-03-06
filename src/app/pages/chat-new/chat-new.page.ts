// src/app/pages/chat-new/chat-new.page.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat-new',
  templateUrl: './chat-new.page.html',
  styleUrls: ['./chat-new.page.scss'],
})
export class ChatNewPage implements OnInit {
  users: any[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    // Fetch users from the server or local storage
    // For demonstration, we'll use a static list
    this.users = [
      { user_id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/150' },
      { user_id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/150' },
    ];
  }

  startChat(userId: string) {
    this.chatService.createChatRoom(this.chatService.currentUserId!, userId, '1', 'Pet Name', 'Owner Name', 'https://via.placeholder.com/150').then((room) => {
      this.router.navigate(['/chat', room.id]);
    }).catch((error) => {
      console.error('Error creating chat room:', error);
    });
  }
}