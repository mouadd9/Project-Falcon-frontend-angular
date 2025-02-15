import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name : 'shorten', // the name that will be used in templates to apply this pipe
    standalone : false
})
export class ShortenPipe implements PipeTransform {
    // this is the method "pure function" that will be called on the data passed through this pipe 
    // example : {{ value | shorten : 20 }} 
    
    transform(value: string, limit : number = 50): string { 
        if (value.length > limit) {
            return value.slice(0, limit) + '...';
        }
        return value;
    } 
}