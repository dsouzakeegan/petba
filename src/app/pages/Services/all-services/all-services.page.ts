import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.page.html',
  styleUrls: ['./all-services.page.scss'],
})
export class AllServicesPage implements OnInit {

  constructor() { }
public services=[
  {service_name:'Adoption',url:'/adoption',image:'https://creature-companions.in/wp-content/uploads/2022/05/D1-Tips-for-the-First-30-Da-ys-of-Dog-Adoption.jpg'},
  {service_name:'Vets',url:'/list/1',image:'https://images.contentstack.io/v3/assets/blt6f84e20c72a89efa/blt80bb54c8b03ce011/6261d1d534ac3928ac55d6a9/zpc_og_article_pets-vet-visit-post-adoption.jpg'},
  {service_name:'Shelter',url:'/list/2',image:'https://www.britannica.com/explore/savingearth/wp-content/uploads/sites/4/2020/05/animal-welfare-1116205_1920.jpg'},
  {service_name:'Grooming',url:'/list/3',image:'https://bpanimalhospital.com/wp-content/uploads/shutterstock_1547371985.jpg'},
  {service_name:'Training',url:'/list/4',image:'https://i.ytimg.com/vi/-UMKFR6bDkI/maxresdefault.jpg'},
  {service_name:'Foster',url:'/list/5',image:'https://www.britannica.com/explore/savingearth/wp-content/uploads/sites/4/2020/05/animal-welfare-1116205_1920.jpg'},
  {service_name:'Rescues',url:'/rescues',image:'https://media.licdn.com/dms/image/D5612AQEl4NEvbn4eng/article-cover_image-shrink_720_1280/0/1677770329576?e=2147483647&v=beta&t=oLx-sgSippM3MxLvCv4bixWxgitDzZ-IKQqELCNrU1o'},
]
  ngOnInit() {
  } 

}
