import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent  implements OnInit {
  @Input() Image:string[]=[];
  // Image="https://www.science.org/do/10.1126/science.aba2340/abs/dogs_1280p_0.jpg"
  constructor() { }

  ngOnInit() {}

}
