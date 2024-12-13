// notification.service.ts
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  async requestPermission() {
    const granted = await LocalNotifications.requestPermissions();
    if (granted.display !== 'granted') {
      console.error('Notification permissions not granted');
    }
  }

  async notifyNewMessage(sender: string, message: string, timestamp: string, imageUrl?: string) {
    const notification: any = {
      title: `New Message from ${sender}`,
      body: `${message}\nReceived at ${timestamp}`,
      id: new Date().getTime(),
      schedule: { at: new Date(Date.now() + 1000) }, // Schedule for immediate notification
      sound: null,
      attachments: null,
      actionTypeId: '',
      extra: null,
    };

    if (imageUrl) {
      notification.attachments = [{ id: '1', url: imageUrl }];
    }

    await LocalNotifications.schedule({
      notifications: [notification],
    });
  }
}
