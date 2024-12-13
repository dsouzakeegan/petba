import { Injectable } from '@angular/core';
import { CanShareResult, Share, ShareOptions } from '@capacitor/share';
interface rescueMsgOptions {
  title?: string;
  greet?: string;
  description?: string;
  link?: string;
  finalWords?: string;
  tags?: string;
}



@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(

  ) { }
//  defaulttitle=
 async shareRescue(msgOptions?:rescueMsgOptions,title?:string)
  {
    let rescueMsg={
      title:msgOptions?.title || "🚨🐾 *_URGENT PET RESCUE_* 🐾🚨",
      greet:msgOptions?.greet || "```Hey everyone```",
      description:msgOptions?.description || "I've just stumbled upon a heartbreaking situation - a precious pet is desperately seeking a loving home. Their situation is urgent, and they need our help. By clicking the link below, you can make a real difference in their life. Whether it's adopting or simply spreading the word, your support matters more than you know, your action can save a life...",
      link:msgOptions?.link || "https://petba.in/home",
      finalWords:msgOptions?.finalWords || "Let's unite to be the voice for those who can't speak for themselves. Together, we can give this furry friend the second chance they deserve.",
      tags:msgOptions?.tags || "#PetRescue #AdoptDontShop ❤️🐾",
    }
    const message=`${rescueMsg.title} \n\n${rescueMsg.greet}, \n\n_${rescueMsg.description}_ \n\n_🐶🐱 *${rescueMsg.link}*  ❤️‍🩹_ \n \n_*" ${rescueMsg.finalWords} "*_ \n\n*_${rescueMsg.tags}_*`;

    let shareOptions :ShareOptions = {

      title:'🚨🐾 URGENT: Help Rescue a Precious Pet! 🐾🚨',
      dialogTitle:'Share this post',
      text:message,
      // url:'', //url is set in message
      // files:[''], //not working
    }
    const {value} =  await Share.canShare();
    console.log(value);
    if(value)
    {
      // this.goShare();
      
    const {activityType} = await Share.share(shareOptions);
    console.log(activityType);
    }
    return;
  }
//  async goShare()
//   {
//     let title="🚨🐾 *_URGENT PET RESCUE_* 🐾🚨";
//     // let urgentText = "I've just stumbled upon a heartbreaking situation - a precious pet is desperately seeking a loving home. Their situation is urgent, and they need our help. By clicking the link below, you can make a real difference in their life. Whether it's adopting or simply spreading the word, your support matters more than you know, your action can save a life..."
//     // let urgentText="I came across this urgent pet rescue situation and wanted to share it with you all. A sweet [insert description of the pet - e.g., dog/cat] urgently needs a loving home. Please take a moment to click on the link below and consider adopting or sharing with someone who might be able to help. Every share counts!"
//     // let urgentText3="This is an urgent plea for help! A precious pet is in desperate need of a loving home. We can't turn a blind eye to their plight. Please, take a moment to click the link below. Whether you're considering adoption or sharing this message, your action could save a life."
//     // let link ='https://petba.in/rescue/10';
//     // let imgUrl ='https://petba.in/Api/api/adoptionImage/rescue.jpg';
//     // let tags ="#PetRescue #AdoptDontShop ❤️🐾"
//     // let greet="```Hey everyone```";
//     // let lastText="Let's unite to be the voice for those who can't speak for themselves. Together, we can give this furry friend the second chance they deserve.";
//     // let lastText2="Let's make a difference together and give this furry friend the second chance they deserve! 🐶❤️🐱 #PetRescue #AdoptDontShop"
//     // let text=`${title} \n\n${greet}, \n\n_${urgentText}_ \n\n_🐶🐱 *${link}*  ❤️‍🩹_ \n \n_*" ${lastText} "*_ \n\n*_${tags}_*`;
//     // let shareOptions :ShareOptions = { 

//     //   title:'🚨🐾Help Rescue a Precious Pet! 🐾🚨',
//     //   // dialogTitle:'',
//     //   text: text,
//     //   url:imgUrl,
      
//     // }
    
//     // const {activityType} = await Share.share(shareOptions);
//     // console.log(activityType);
//   }
}
