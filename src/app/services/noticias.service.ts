import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadLines } from '../interfaces/interfaces'
import { environment } from 'src/environments/environment';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

const headers = new HttpHeaders({
    'X-Api-key': apiKey
})

@Injectable({
  providedIn: 'root'
})

export class NoticiasService {

    headLines = 0;

    categoriaActual = '';
    categoriaPage = 0;

  constructor(private http: HttpClient) { }

  private buildQuery<T>(query : string){
      return this.http.get<T>(`${apiUrl}${query}`, {headers});
  }

  getTopHeadLines(){
      this.headLines++;
      return this.buildQuery<RespuestaTopHeadLines>(`/top-headlines?country=mx&page=${this.headLines}`);
  }

  getTopHeadLinesCategoria(categoria : string){
      if(this.categoriaActual === categoria){
        this.categoriaPage++;
      }else{
          this.categoriaPage = 1;
          this.categoriaActual = categoria;
      }

      return this.buildQuery<RespuestaTopHeadLines>(`/top-headlines?country=mx&category=${categoria}&page=${this.categoriaPage}`);
  }

}
