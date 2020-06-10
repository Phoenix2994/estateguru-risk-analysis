import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormComponent } from './components/form/form.component';
import { RiskRoutingModule } from './risk-routing.module';
import { MlEngineService } from './services/ml-engine.service';
import { RiskDetailComponent } from './components/risk-detail/risk-detail.component';


@NgModule({
    imports: [
        SharedModule,
        RiskRoutingModule
    ],
    declarations: [
        FormComponent,
        RiskDetailComponent
    ],
    providers:[
        MlEngineService
    ]

})
export class RiskModule { }