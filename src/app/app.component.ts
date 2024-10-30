import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Collaborative Text Editor</h1>
      <app-editor docId="test-doc-1"></app-editor>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {
  title = 'collaborative-editor';
}
