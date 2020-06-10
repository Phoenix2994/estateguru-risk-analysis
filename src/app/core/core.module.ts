import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';


@NgModule({
    imports: [
        SharedModule,
        CoreRoutingModule
    ],
    declarations: [DashboardComponent],
    exports: [DashboardComponent]
})
export class CoreModule { }
