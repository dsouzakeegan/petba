import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {

  img:string[]=[]
  constructor(private router: Router,public navCtrl:NavController) { }

  ngOnInit() {
    let data =   this.router.getCurrentNavigation()?.extras.state?.['img'];
 console.log(data);
 this.img.push(...data)
  }

  getImage()
  {
   
  }
}
