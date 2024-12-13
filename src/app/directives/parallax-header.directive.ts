import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DomController, ScrollCustomEvent } from '@ionic/angular';

@Directive({
  selector: '[appParallaxHeader]'
})
export class ParallaxHeaderDirective {
/*=============Variables-------------------*/
header:any;
headerHeight:number|undefined;
moveImage:number|undefined;
scaleImage:number=1;
  constructor(
    public element :ElementRef,
    public renderer : Renderer2,
    private domCtrl:DomController
  ) { }

  ngAfterViewInit (){
    let content = this.element.nativeElement;
    this.header=content.getElementsByClassName('parallax-image')[0];
    this.renderer.setStyle(this.header, 'webkitTransition', 'transform 10ms');
    this.domCtrl.read(()=>{
      this.headerHeight = this.header.clientHeight; 
      // this.headerHeight = 240; 
      console.log(this.headerHeight);
      
    });
  }

  /*On Scroll */
 @HostListener('ionScroll',['$event']) onContentScroll($event :ScrollCustomEvent){
  const scrollTop =$event.detail.scrollTop
  this.domCtrl.write(()=>{
    if(scrollTop > 0)
      {
        this.moveImage = scrollTop / 3 ;
        this.scaleImage = 1 ;
      }else{
        this.moveImage = scrollTop/ 1.4 ;

        this.scaleImage = this.headerHeight ?  scrollTop / this.headerHeight + 1 : 1; 
      }
      this.renderer.setStyle(this.header , 'transform',
        `translate3d(0,${this.moveImage}px,0) scale(${this.scaleImage})`
      )
  });
 }
}
