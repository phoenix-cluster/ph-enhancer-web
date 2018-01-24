/**
 * Created by baimi on 2017/9/21.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { LowConfPsmsComponent } from './components/low-conf-psms/low-conf-psms.component';
import { HighConfPsmsComponent } from './components/high-conf-psms/high-conf-psms.component';
import { NewIdentifiedComponent } from './components/new-identified/new-identified.component';

const routes: Routes = [
    {path: '', redirectTo: '/index', pathMatch: 'full'},
    {path: 'index', component: HomePageComponent},
    {path: 'low_conf/:project', component: LowConfPsmsComponent},
    {path: 'high_conf/:project', component: HighConfPsmsComponent},
    {path: 'new_id/:project', component: NewIdentifiedComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}
