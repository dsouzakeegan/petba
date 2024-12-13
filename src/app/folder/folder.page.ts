// Folder.page.ts

import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class InboxPage implements OnInit {
  notifications: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  // Load notifications from ChatService
  loadNotifications() {
    this.notifications = this.chatService.getStoredNotifications();
  }
}
