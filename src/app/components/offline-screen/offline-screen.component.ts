import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-offline-screen',
  templateUrl: './offline-screen.component.html',
  styleUrls: ['./offline-screen.component.scss'],
})
export class OfflineScreenComponent  implements OnInit {
  constructor(private modalCtrl: ModalController,private http:HttpClient) { 
    this.setImage();
  }

  assests=[
    '../../../assets/animations/pigTruck.json',
    '../../../assets/animations/lama.json',
    '../../../assets/animations/dog.json',
    '../../../assets/animations/camelrun.json',
    '../../../assets/animations/animalPack.json',
  ]
  options: AnimationOptions = {};
  styles:Partial<CSSStyleDeclaration>={
    height:'70%',
    objectFit:'cover'
  }

async setImage()
{
  const lottieData = await firstValueFrom(this.http.get<any>(this.getRandomElement(this.assests)))
  this.options ={ 
 animationData :lottieData
    } 

}
getRandomElement(arr:any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
  ngOnInit() {}

  close()
  {
    this.modalCtrl.dismiss();
  }
}
