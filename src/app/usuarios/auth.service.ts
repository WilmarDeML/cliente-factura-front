import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario
  private _token: string

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario) {
      return this._usuario
    }
    if(sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario
      return this._usuario
    }
    return new Usuario()
  }

  public get token(): string {
    if (this._token) {
      return this._token
    }
    if(sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token')
      return this._token
    }
    return ''
  }

  login(usuario: Usuario): Observable<any> {
    // const urlEndpoint = 'http://localhost:8080/oauth/token'
    const urlEndpoint = `${URL_BACKEND}/oauth/token`
    const credenciales = window.btoa('angularapp:12345')
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic ' + credenciales})
    let params = new URLSearchParams();
    params.set('grant_type', 'password')
    params.set('username', usuario.username)
    params.set('password', usuario.password)
    console.log(params.toString())
    return this.http.post(urlEndpoint, params.toString(), {headers: httpHeaders})
  }

  logout(): void {
    this._token = null
    this._usuario = null
    sessionStorage.clear()
  }

  guardarUsuario(access_token: string): void {
    const payload = this.obtenerDatosToken(access_token)
    this._usuario = new Usuario()
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario))
  }

  guardarToken(access_token: string): void {
    this._token = access_token
    sessionStorage.setItem('token', access_token)
  }

  obtenerDatosToken(access_token: string) {
    return JSON.parse(window.atob(access_token?.split('.')[1])) || null
  }

  isAuthenticated(): boolean {
    return this.token && this.obtenerDatosToken(this.token).user_name
  }

  hasRol(rol: string): boolean {
    return this.usuario.roles.includes(rol)
  }
}
