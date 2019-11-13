import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppComponent} from './app.component';
import {appRoutingModule} from './app.routing';


import {
  MatButtonModule,
  MatFormFieldControl,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule
} from '@angular/material';

import { DragDropModule } from '@angular/cdk/drag-drop';

import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {AdminComponent} from './admin';
import {LoginComponent} from './login';
import {AudioComponent} from '@app/audio/audio.component';
import {VideoComponent} from '@app/video/video.component';
import {DocumentComponent} from '@app/document/document.component';
import {UsersComponent} from '@app/users/users.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DocumentCategoryComponent } from './document-category/document-category.component'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component'
;
import { AffirmationComponent } from './affirmation/affirmation.component'
import {ColorSketchModule} from "ngx-color/sketch";
import {ColorCircleModule} from "ngx-color/circle";
import {ColorMaterialModule} from "ngx-color/material";
import {ColorSliderModule} from "ngx-color/slider";
import {ColorTwitterModule} from "ngx-color/twitter";
import {ColorShadeModule} from "ngx-color/shade";
import {ColorChromeModule} from "ngx-color/chrome";
import {ColorAlphaModule} from "ngx-color/alpha";
import {ColorBlockModule} from "ngx-color/block";
import {ColorGithubModule} from "ngx-color/github";
import {ColorSwatchesModule} from "ngx-color/swatches";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    DragDropModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    MatCheckboxModule,
    MatSortModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ColorSketchModule,
    ColorCircleModule,
    ColorMaterialModule,
    ColorSliderModule,
    ColorTwitterModule,
    ColorShadeModule,
    ColorChromeModule,
    ColorAlphaModule,
    ColorBlockModule,
    ColorGithubModule,
    ColorSwatchesModule,
    MatButtonToggleModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    AudioComponent,
    VideoComponent,
    DocumentComponent,
    UsersComponent,
    DocumentCategoryComponent ,
    ForgottenPasswordComponent
,
    AffirmationComponent  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
