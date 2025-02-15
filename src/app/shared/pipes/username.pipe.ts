import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name : 'username',
    standalone : false
})
export class UsernamePipe implements PipeTransform {
    transform(value: {fistName: string, lastName: string}): string {
        return `${value.lastName.toUpperCase()} ${value.fistName} `;
    }
}