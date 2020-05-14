import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import {ScrollingModule} from '@angular/cdk/scrolling';

import { MessageBarService } from './services/message-bar.service';


// Material modules used throughout this application
const materialElements = [
  MatButtonModule,
  MatToolbarModule,
  MatTooltipModule,
  MatListModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDividerModule,

  ScrollingModule
];

/**
 * Container module for other angular material modules used
 * in this application, along with other custom helper services.
 *
 * @tip You only need to import this module once whenever you have to
 * use Angular material modules.
 */
@NgModule({
  declarations: [],
  imports: [
    materialElements
  ],
  exports: [
    materialElements
  ],
  providers: [
    MessageBarService
  ]
})
export class MaterialModule { }

export * from './services/message-bar.service';
