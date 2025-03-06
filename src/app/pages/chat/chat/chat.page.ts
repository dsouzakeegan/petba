import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.socket = io(this.serverUrl);
    this.socket.on('chat message', (msg: string) => {
      this.messages.push(msg);
      console.log('initialised');
    });

    this.route.paramMap.subscribe(params => {
      this.customer1 = params.get('sender_id') || '';
      this.customer2 = params.get('receiver_id') || '';
      this.adoptionId = params.get('adoption_id') || '';
      this.joinRoom();
    });
  }

  joinRoom() {
    if (this.customer1 && this.customer2 && this.adoptionId) {
      console.log('room joined ');
      this.socket.emit('join room', {
        customer1: this.customer1,
        customer2: this.customer2,
        adoptionId: this.adoptionId
      });
    }
  }

  sendMessage() {
    console.log('message send ');
    if (this.message.trim() && this.customer1 && this.customer2 && this.adoptionId) {
      this.socket.emit('chat message', {
        customer1: this.customer1,
        customer2: this.customer2,
        adoptionId: this.adoptionId,
        message: this.message
      });
      this.message = '';
    }
  }
}