import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: string|undefined, ...args: string[]): unknown {
    return (value == '1' ?"male":"female");
    
  }

}
