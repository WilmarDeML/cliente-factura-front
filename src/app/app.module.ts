import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component'
import { PaginadorComponent } from './paginador/paginador.component'

import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'

registerLocaleData(localeES, 'es')

const ROUTES: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent},
  {path: 'clientes/form/:id', component: FormComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginadorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [ClienteService, {provide: LOCALE_ID, useValue: 'es-CO'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
