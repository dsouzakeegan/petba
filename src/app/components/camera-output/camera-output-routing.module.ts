import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraOutputComponent } from './camera-output.component';

const routes: Routes = [{
  path: '',
  component: CameraOutputComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CameraOutputRoutingModule { }
