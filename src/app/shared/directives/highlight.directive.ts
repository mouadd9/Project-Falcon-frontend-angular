import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appHighlight]',
    standalone: false
})
export class HighlightDirective implements AfterViewInit {
    constructor(private el: ElementRef, // el will contain the DOM ref to the native element where the directive is applied
                private renderer: Renderer2) {}

    @Input() color: string = 'purple';

    ngAfterViewInit(): void {
        this.setBackgroudColor(this.color);
    }

    setBackgroudColor(color: string){
        this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
    }

}