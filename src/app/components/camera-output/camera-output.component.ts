import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-output',
  templateUrl: './camera-output.component.html',
  styleUrls: ['./camera-output.component.scss'],
  imports: [ IonicModule, CommonModule ],
  standalone: true
})
export class CameraOutputComponent  implements OnInit {
  @Input() message!: string;  // The message that will be displayed in the modal
  @Input() imageUrl!: string; // The image URL that will be displayed

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  // Method to close the modal
  dismiss() {
    this.modalController.dismiss();
  }

  // Method to refresh the page
  refresh() {
    this.modalController.dismiss();
    window.location.reload();
  }
}
