import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { RiskDetailComponent } from './components/risk-detail/risk-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FormComponent
  },
  {
    path: 'detail',
    component: RiskDetailComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskRoutingModule { }