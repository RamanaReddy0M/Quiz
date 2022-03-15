import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  getAllQuestion(){
    return this.http.get<any>("assets/questions.json");
  }
}
