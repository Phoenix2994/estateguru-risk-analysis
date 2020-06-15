import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        FormsModule
    ],
    declarations: [],
    exports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        FormsModule
    ] 
})
export class SharedModule { }
