import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController, ScrollCustomEvent } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit{

@Input('appHideHeader') toolbar:any;
 toolbarHeight = 56;
 _ScrollTop_Start=0;


 constructor(private renderer:Renderer2,private domCtrl:DomController) { }
 ngOnInit(): void {
  this.toolbar =this.toolbar.el ;
  this.renderer.setStyle(this.toolbar, 'webkitTransition', 'top 250ms');
  this.domCtrl.read(()=>{
    
    // this.toolbarHeight = (this.toolbar as HTMLIonToolbarElement).clientHeight; //uncomment this to use the element height 
  })
 }

 @HostListener('ionScroll',['$event']) onContentScroll($event :ScrollCustomEvent)
 {
  const scrollTop = $event.detail.scrollTop;
  let newPositon :number;
  if(scrollTop < this._ScrollTop_Start) //SCROLL DOWN [Show toolbar]
    { 
      // const scroll_diff = this._ScrollTop_Start - scrollTop;
      newPositon = (this.toolbarHeight); 
    }else{         //SCROLL UP [Hide toolbar]
          newPositon = -(scrollTop / 5);
         if( newPositon < -this.toolbarHeight){ newPositon = -this.toolbarHeight;}
      }
      if(newPositon > 0)
        {
          newPositon = 0;
        }
      this.domCtrl.write(()=>{
        this.renderer.setStyle(this.toolbar,'top',`${newPositon}px`)
      })
    this._ScrollTop_Start=scrollTop;
 }
}
