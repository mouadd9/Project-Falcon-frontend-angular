import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-markdown-renderer',
  standalone: false,
  template: `<markdown class="markdown-content" [data]="content"></markdown>`,
  styleUrls: []
})
export class MarkdownRendererComponent {
  @Input() content: string = '';
}