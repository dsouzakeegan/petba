import { NgModule } from "@angular/core";
import { GenderPipe } from "./gender/gender.pipe";
import { AgePipe } from './age/age.pipe';

@NgModule({
declarations:[GenderPipe, AgePipe],
imports:[],
exports:[GenderPipe,AgePipe],
})
export class pipesModule{}