import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCheckSingleOption]'
})
export class CheckSingleOptionDirective {

  @Input() isCorrect: boolean = false;  

  constructor(private el: ElementRef, private render: Renderer2) { }

  @HostListener('click') answer(){
    const span = this.render.createElement('span');
    const classes = "fs-4 bi";
    classes.split(" ").forEach((c)=>{
      this.render.addClass(span, c);
    });

    if(this.isCorrect){
      this.render.addClass(span, "bi-check2-circle");
      this.render.addClass(span, "text-success");
    }else{
      this.render.addClass(span, "bi-x-circle");
      this.render.addClass(span, "text-danger");
    }
    this.render.appendChild(this.el.nativeElement, span);
    this.render.addClass(this.el.nativeElement, 'border-none');
    //this.render.insertBefore(this.el.nativeElement, span, this.el.nativeElement);
    //this.render.addClass(this.el.nativeElement, 'visually-hidden');
  }

}
