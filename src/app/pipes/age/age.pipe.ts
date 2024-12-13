import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(birthDate: string | undefined, ...args: unknown[]): string {
    const [param ,opt] = args;
     if (param === 'date') {
      if(opt == "1")
        {
          return this.getTimePassed(birthDate);
        }else{
          return this.getDate1(birthDate);
        }
    } else {
      return this.getAge(birthDate);
    }
  }
  getAge(birthDate: string | undefined): string {
    if (birthDate) {
      let myage;
      let mymonth;
      let myday;
      const today = new Date();
      const bdate = new Date(birthDate);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      // let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      myage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
      if (myage === 0) {
        const day = 1000 * 60 * 60 * 24;
        var days = Math.floor(timeDiff / day);
        mymonth = Math.floor(days / 31);

        if (mymonth === 0) {
          myday = Math.floor(timeDiff / day);
          if (myday === 1) {
            return `new born`;
          } else {
            return `${myday} days old`;
          }
        } else {
          if (mymonth === 1) {
            return `${mymonth} month old`;
          } else {
            return `${mymonth} months old`;
          }
        }
      } else {
        if (myage === 1) {
          return `${myage} year old`;
        } else {
          return `${myage} years old`;
        }
      }
    } else {
      return `N/A`;
    }
  }
  // getDate(birthDate: string | undefined): string {
  //   if (birthDate) {
  //     let myage;
  //     let mymonth;
  //     let myday;
  //     const today = new Date();
  //     const bdate = new Date(birthDate);
  //     const timeDiff = Math.abs(Date.now() - bdate.getTime());
  //     // let age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  //     myage = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  //     if (myage === 0) {
  //       let day = 1000 * 60 * 60 * 24;
  //       var days = Math.floor(timeDiff / day);
  //       mymonth = Math.floor(days / 31);

  //       if (mymonth === 0) {
  //         myday = Math.floor(timeDiff / day);
  //         if (myday === 1) {
  //           return `today`;
  //         } else {
  //           // return `${myday} days old`
  //           return `${myday} days `;
  //         }
  //       } else {
  //         if (mymonth === 1) {
  //           return `${mymonth} month `;
  //         } else {
  //           return `${mymonth} months `;
  //         }
  //       }
  //     } else {
  //       if (myage === 1) {
  //         return `${myage} year `;
  //       } else {
  //         return `${myage} years `;
  //       }
  //     }
  //   } else {
  //     return `N/A`;
  //   }
  // }

  //  getAge(Date:any){

  //  // if(birthDate){

  //     //   const birthYear = parseInt(birthDate.split('-')[0]);
  //     //   const birthMonth = parseInt(birthDate.split('-')[1]) - 1; // Months are zero-based
  //     //   const birthDay = parseInt(birthDate.split('-')[2]);

  //     //   const birth = new Date(birthYear, birthMonth, birthDay);

  //     //   let age = today.getFullYear() - birthYear;

  //     //   if (
  //     //     today.getMonth() < birth.getMonth() ||
  //     //     (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  //     //     ) {
  //     //       age--;
  //     //     }
  //     //      let a =age.toString();
  //     //     return `${age} Years Old`;
  //     //   }else{
  //     //     return `N/A`;
  //     //   }
  // }
  // parseDateTime(dateTimeString: string) {
  //   const dateTimeParts = dateTimeString.split(' ');
  //   const dateParts = dateTimeParts[0].split('-');
  //   const timeParts = dateTimeParts[1].split(':');
  //   const year = parseInt(dateParts[0], 10);
  //   const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
  //   const day = parseInt(dateParts[2], 10);
  //   const hour = parseInt(timeParts[0], 10);
  //   const minute = parseInt(timeParts[1], 10);
  //   const second = parseInt(timeParts[2], 10);
  //   return new Date(year, month, day, hour, minute, second);
  // }
  // getDate2(birthDate:string|undefined) :string
  // {
  //   if(birthDate)
  //   {
  //     const year_milliSeconds    = 1000 * 60 * 60 * 24 * 365;
  //     const month_milliSeconds    = 1000 * 60 * 60 * 24 * 31;
  //     const week_milliSeconds     = 1000 * 60 * 60 * 24 * 7;
  //     const day_milliSeconds     = 1000 * 60 * 60 * 24 ;
  //     const hour_milliSeconds    = 1000 * 60 * 60;
  //     const minute_milliSeconds  = 1000 * 60;
  //     const second_milliSeconds  = 1000;

  //     const bdate = new Date(birthDate);
  //     // const bdate = new Date('2024-02-26T07:49:00.000Z');
  //     // const bdate = this.parseDateTime(birthDate);
  //     // const bdate =  new Date("Feburary 26, 2024 12:59:00");
  //     const timeDiff = Math.abs(Date.now() - bdate.getTime());
  //  const years = Math.floor(timeDiff /year_milliSeconds);
  //  const months = Math.floor(timeDiff / month_milliSeconds);
  //  const weeks = Math.floor(timeDiff / week_milliSeconds);
  //  const days = Math.floor(timeDiff / day_milliSeconds);
  // //  const myday = Math.floor(timeDiff / day);
  // //  const hours = Math.floor((timeDiff % day_milliSeconds) / hour_milliSeconds);
  // const hours = Math.floor(timeDiff / hour_milliSeconds);

  //  const minutes = Math.floor((timeDiff % hour_milliSeconds) / minute_milliSeconds);
  // if (years === 0) {

  //   if (months === 0 ) {
  //     if(days === 0)
  //     {
  //       if(hours === 0)
  //       {
  //         if(minutes === 0)
  //         {
  //               // var seconds = Math.floor((timeDiff % minute) / second);

  //           // return `${seconds} seconds ago `
  //           return ` few seconds `

  //         }else{

  //           if(minutes === 1)
  //         {
  //           return `${minutes} minute `

  //         }else{

  //           return `${minutes} minutes `
  //         }
  //         }

  //       }else{

  //         if(hours === 1)
  //       {
  //         return `${hours} hour `

  //       }else{

  //         return `${hours} hours `
  //       }
  //       }

  //     }else{

  //       if(days === 1)
  //     {
  //       return `${days} day `

  //     }else{

  //       return `${days} days `
  //     }
  //       // return `${myday} days old`
  //       // return `${myday} days `
  //     }
  //   }else{
  //     if(months === 1)
  //     {
  //       return `${months} month `

  //     }else{

  //       return `${months} months `
  //     }

  //   }

  // }else{
  //   if(years === 1)
  //     {
  //       return `${years} year `

  //     }else{

  //       return `${years} years `
  //     }

  // }
  //   }else{
  //     return `N/A`;
  //   }
  // }

  getDate1(birthDate: string | undefined): string {
    if (birthDate) {
      const year_milliSeconds = 1000 * 60 * 60 * 24 * 365;
      const month_milliSeconds = 1000 * 60 * 60 * 24 * 31;
      const week_milliSeconds = 1000 * 60 * 60 * 24 * 7;
      const day_milliSeconds = 1000 * 60 * 60 * 24;
      const hour_milliSeconds = 1000 * 60 * 60;
      const minute_milliSeconds = 1000 * 60;
      const second_milliSeconds = 1000;

      const bdate = new Date(birthDate);
      // const bdate = new Date('2024-02-26T07:49:00.000Z');
      // const bdate = this.parseDateTime(birthDate);
      // const bdate =  new Date("Feburary 26, 2024 12:59:00");
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      const years = Math.floor(timeDiff / year_milliSeconds);
      const months = Math.floor(timeDiff / month_milliSeconds);
      const weeks = Math.floor(timeDiff / week_milliSeconds);
      const days = Math.floor(timeDiff / day_milliSeconds);
      //  const myday = Math.floor(timeDiff / day);
      //  const hours = Math.floor((timeDiff % day_milliSeconds) / hour_milliSeconds);
      const hours = Math.floor(timeDiff / hour_milliSeconds);

      const minutes = Math.floor(
        (timeDiff % hour_milliSeconds) / minute_milliSeconds
      );
      if (years === 0) {
        if (months === 0) {
          if (weeks == 0) {
            if (days === 0) {
              if (hours === 0) {
                if (minutes === 0) {
                  // var seconds = Math.floor((timeDiff % minute) / second);
  
                  // return `${seconds} seconds ago `
                  return ` few seconds `;
                } else {
                  if (minutes === 1) {
                    return `${minutes} minute `;
                  } else {
                    return `${minutes} minutes `;
                  }
                }
              } else {
                if (hours === 1) {
                  return `${hours} hour `;
                } else {
                  return `${hours} hours `;
                }
              }
            } else {
              if (days === 1) {
                return `${days} day `;
              } else {
                return `${days} days `;
              }
              // return `${myday} days old`
              // return `${myday} days `
            }
          } else {
            if(weeks == 1)
            {
              return `${weeks} week `
            }else{
              return `${weeks} weeks `
            }
          }

       
        } else {
          if (months === 1) {
            return `${months} month `;
          } else {
            return `${months} months `;
          }
        }
      } else {
        if (years === 1) {
          return `${years} year `;
        } else {
          return `${years} years `;
        }
      }
    } else {
      return `N/A`;
    }
  }
  getTimePassed(birthDate: string | undefined): string {
    if (birthDate) {
      const year_milliSeconds = 1000 * 60 * 60 * 24 * 365;
      const month_milliSeconds = 1000 * 60 * 60 * 24 * 31;
      const week_milliSeconds = 1000 * 60 * 60 * 24 * 7;
      const day_milliSeconds = 1000 * 60 * 60 * 24;
      const hour_milliSeconds = 1000 * 60 * 60;
      const minute_milliSeconds = 1000 * 60;
      const second_milliSeconds = 1000;

      const bdate = new Date(birthDate);
      // const bdate = new Date('2024-02-26T07:49:00.000Z');
      // const bdate = this.parseDateTime(birthDate);
      // const bdate =  new Date("Feburary 26, 2024 12:59:00");
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      const years = Math.floor(timeDiff / year_milliSeconds);
      const months = Math.floor(timeDiff / month_milliSeconds);
      const weeks = Math.floor(timeDiff / week_milliSeconds);
      const days = Math.floor(timeDiff / day_milliSeconds);
      //  const myday = Math.floor(timeDiff / day);
      //  const hours = Math.floor((timeDiff % day_milliSeconds) / hour_milliSeconds);
      const hours = Math.floor(timeDiff / hour_milliSeconds);

      const minutes = Math.floor(
        (timeDiff % hour_milliSeconds) / minute_milliSeconds
      );
      if (years === 0) {
        if (months === 0) {
          if (weeks == 0) {
            if (days === 0) {
              if (hours === 0) {
                if (minutes === 0) {
                  // var seconds = Math.floor((timeDiff % minute) / second);
  
                  // return `${seconds} seconds ago `
                  return ` few secs `;
                } else {
                  if (minutes === 1) {
                    return `${minutes} min `;
                  } else {
                    return `${minutes} min `;
                  }
                }
              } else {
                if (hours === 1) {
                  return `${hours} hr `;
                } else {
                  return `${hours} hrs `;
                }
              }
            } else {
              if (days === 1) {
                return `${days} day `;
              } else {
                return `${days} days `;
              }
              // return `${myday} days old`
              // return `${myday} days `
            }
          } else {
            if(weeks == 1)
            {
              return `${weeks} week `
            }else{
              return `${weeks} weeks `
            }
          }

       
        } else {
          if (months === 1) {
            return `${months} month `;
          } else {
            return `${months} months `;
          }
        }
      } else {
        if (years === 1) {
          return `${years} yr `;
        } else {
          return `${years} yrs `;
        }
      }
    } else {
      return `N/A`;
    }
  }
}
