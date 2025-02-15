// glow-effect.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGlowEffect]',
  standalone: false
})
export class GlowEffectDirective implements OnInit {
  @Input() glowColor: string = 'rgba(255, 78, 166, 1)'; // Default pink color
  @Input() glowIntensity: number = 1; // Control the intensity of the glow

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Add the base styles
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '2');

    // Create and add the keyframes style
    const keyframesStyle = `
      @keyframes pulse-glow {
        0% {
          filter: drop-shadow(0 0 30px ${this.adjustOpacity(this.glowColor, 0.2 * this.glowIntensity)})
                  drop-shadow(0 0 60px ${this.adjustOpacity(this.glowColor, 0.1 * this.glowIntensity)})
                  drop-shadow(0 0 100px ${this.adjustOpacity(this.glowColor, 0.05 * this.glowIntensity)});
        }
        50% {
          filter: drop-shadow(0 0 50px ${this.adjustOpacity(this.glowColor, 0.8 * this.glowIntensity)})
                 drop-shadow(0 0 100px ${this.adjustOpacity(this.glowColor, 0.6 * this.glowIntensity)})
                 drop-shadow(0 0 150px ${this.adjustOpacity(this.glowColor, 0.4 * this.glowIntensity)})
                 drop-shadow(0 0 200px ${this.adjustOpacity(this.glowColor, 0.2 * this.glowIntensity)});
        }
        100% {
          filter: drop-shadow(0 0 30px ${this.adjustOpacity(this.glowColor, 0.2 * this.glowIntensity)})
                  drop-shadow(0 0 60px ${this.adjustOpacity(this.glowColor, 0.1 * this.glowIntensity)})
                  drop-shadow(0 0 100px ${this.adjustOpacity(this.glowColor, 0.05 * this.glowIntensity)});
        }
      }
    `;

    // Add animation styles
    this.renderer.setStyle(this.el.nativeElement, 'animation', 'pulse-glow 4s infinite ease-in-out');
    
    // Add the keyframes to the document
    const styleElement = this.renderer.createElement('style');
    const textNode = this.renderer.createText(keyframesStyle);
    this.renderer.appendChild(styleElement, textNode);
    this.renderer.appendChild(document.head, styleElement);
  }

  private adjustOpacity(color: string, opacity: number): string {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/g, `${opacity})`);
    }
    if (color.startsWith('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    }
    // For hex colors or other formats, you might want to add more conversion logic
    return color;
  }
}