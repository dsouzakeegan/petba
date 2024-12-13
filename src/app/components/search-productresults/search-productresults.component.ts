import { Component, Input, OnInit } from '@angular/core';
export interface ListData{
  id:string,
  name:string,
  category:string,
  image:string
}
@Component({
  selector: 'app-search-productresults',
  templateUrl: './search-productresults.component.html',
  styleUrls: ['./search-productresults.component.scss'],
})

export class SearchProductresultsComponent  implements OnInit {
@Input() results:ListData[]=[] ;
  constructor() { }

  ngOnInit() {}

}
