import * as Q from "q";

export class Question {
    
    constructor(
        public id: number, 
        public type: string,
        public question: string,
        public option1: string,
        public option2: string,
        public option3: string,
        public option4: string,
        public answer: string){


    }
}
