import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Question } from '../model/question';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string = "";
  questions:any = [];
  currentQuestion: number = 0;
  disablePrevious: boolean = true;
  disableNext: boolean = false;
  isWrong: boolean  = false;
  score: number = 0.0;
  isSubmitted: boolean = false;
  counter: number = 0;
  selectedOption: string = '1';

  @ViewChild('endTest') endTest: ElementRef;
  @ViewChildren('selected') selected: QueryList<ElementRef>;
  @ViewChildren('caseSensitive') caseSensitive: QueryList<ElementRef>;
  @ViewChildren('caseInsensitive') caseInsensitive: QueryList<ElementRef>;

  constructor(private http: QuestionService, private render: Renderer2) { }

  ngOnInit(): void {
    this.name= localStorage.getItem("name");
    this.http.getAllQuestion().subscribe(data => {
      this.questions = data.questions;
    });
  }

  next(){
    if(this.currentQuestion == this.questions.length-1){
      this.render.addClass(this.endTest.nativeElement, 'visually-hidden');
      this.isSubmitted = true;
      // this.disableNext = true;
      // this.disablePrevious = false;
    }else{
      this.currentQuestion++;
      if(this.currentQuestion == this.questions.length - 1)
        this.disableNext = true;
      this.disablePrevious = false;
    }
     
  }
  previous(){
    if(this.currentQuestion == 0){
      this.disablePrevious = true;
      this.disableNext = false;
    }else{
      this.currentQuestion--;
      if(this.currentQuestion == 0)
        this.disablePrevious = true;
      this.disableNext = false;
    }
     
  }

  public checkIsWrongOfSingle(isCorrect: boolean){
    if(!isCorrect){
      this.isWrong = true;
      setTimeout(()=>{
        this.next();
        this.isWrong = false;
      },2000);
    }else{
      setTimeout(() => {
        this.score++;
        this.next();
      }, 1000);
    }
  }

  public checkIsWrongOfMultiple(isCorrect: boolean, options: any){
    options?.forEach(element => {
      if(element.isCorrect)
          this.counter++;
    });

    if(!isCorrect){
      this.isWrong = true;
      setTimeout(() =>{
        this.next();
        this.isWrong = false;
      }, 1000);
    }else{
      this.score += (1/this.counter);
    }
    this.counter = 0;
  }

  public getList(question: any){
    return question?.split("____");
  }
  checkAnswerForDropDown(option: any, answer: any, i : any){
    //console.log('ans: '+answer+', opt: '+option+", i: "+i);
    //this.selected.forEach(e => console.log(e));
    if(option == answer)
      this.score += (1/this.selected.length);
    this.addIconTrueOrFalse((option == answer), option, this.selected.get(i));
    this.render.addClass(this.selected.get(i).nativeElement, 'visually-hidden');
  }

  checkAnswerForCaseSensitive(value: any, answer: any, i: any){
   // console.log("v: "+value+", ans: "+answer);
   // console.log("childs: "+this.caseSensitive);
   if(value == answer)
   this.score += (1/this.caseSensitive.length);
    this.addIconTrueOrFalse((value == answer), value, this.caseSensitive.get(i));
    this.render.addClass(this.caseSensitive.get(i).nativeElement, 'visually-hidden');
  }

  checkAnswerForCaseInsensitive(value: string, answer: any, i: any){
    let isCorrect: boolean = false;
    const a: string[] = answer.split("or");
    a.forEach( (e) => {
      //console.log("e: "+e+", v:"+value.trim().toLowerCase+", "+e.trim().toLowerCase);
      if(value.trim().toLowerCase()  == e.trim().toLowerCase()){
        isCorrect = true;
        this.score += (1 / this.caseInsensitive.length);
      }
    });
    //console.log("a: "+a+", isC: "+isCorrect+", ref: "+this.caseInsensitive.get(i));
    this.addIconTrueOrFalse(isCorrect, value, this.caseInsensitive.get(i));
    this.render.addClass(this.caseInsensitive.get(i).nativeElement, 'visually-hidden');

  }

  addIconTrueOrFalse(isCorrect: boolean, data: any,el: ElementRef){
    const span = this.render.createElement('span');
    const text = this.render.createText(data);
    this.render.appendChild(span, text);
    const classList = 'fs-4 m-2 bi';
    classList.split(' ').forEach((c : string) => {
      this.render.addClass(span, c);
    });
    if(isCorrect){
      this.render.addClass(span, 'bi-check2-circle');
      this.render.addClass(span, 'text-success');
    }else{
      this.render.addClass(span, 'bi-x-circle');
      this.render.addClass(span, 'text-danger');
    }

    this.render.appendChild(span, text);
    this.render.appendChild(el.nativeElement, span);
    this.render.insertBefore(this.render.parentNode(el.nativeElement), span, el.nativeElement);
  }

}
