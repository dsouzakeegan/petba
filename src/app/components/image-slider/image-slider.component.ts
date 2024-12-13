import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent  implements OnInit {
@Input() Images:string[]=[];
@Input() thumbs:boolean=true;
@Input() ratio:number=9/6;
@Input() objectFit:string="cover";
@Input() ImgError:string="../../../../../assets/error/owl-login.png";
// @Input() ImgError:string="../../../../../assets/error/fallback-image.png";
  constructor() {}

  ngOnInit() {
    if(this.Images.length == 0)
    {
      this.Images.push(this.ImgError);
    }
  }

}
