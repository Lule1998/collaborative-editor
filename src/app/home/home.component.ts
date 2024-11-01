
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="header">
        <h1 class="title">Zajednički uređivač teksta</h1>
      </header>

      <main class="main">
        <div class="documents-grid">
          
          <div class="create-document-card" (click)="createNewDocument()">
            <div class="icon-container">
              <svg class="plus-icon" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Napravi Novi Dokument</h3>
            <p>Počnite sarađivati ​​sa svojim timom</p>
          </div>

          
          <div *ngFor="let doc of recentDocuments" class="document-card" (click)="openDocument(doc.id)">
            <div class="doc-icon">
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>{{doc.name}}</h3>
            <p>Zadnja promena {{doc.lastEdited}}</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      margin-bottom: 3rem;
      text-align: center;
    }

    .title {
      font-size: 2.5rem;
      color: #2d3748;
      margin: 0;
    }

    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .create-document-card, .document-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid #e2e8f0;
    }

    .create-document-card:hover, .document-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .icon-container {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      background: #ebf4ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .plus-icon {
      width: 32px;
      height: 32px;
      color: #3182ce;
    }

    h3 {
      color: #2d3748;
      margin: 1rem 0 0.5rem;
      font-size: 1.25rem;
    }

    p {
      color: #718096;
      margin: 0;
      font-size: 0.875rem;
    }

    .doc-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;
      color: #4a5568;
    }
  `]
})
export class HomeComponent {
  recentDocuments = [
    { id: '1', name: 'Beleske o projektu', lastEdited: 'Pre 2 sata' },
    { id: '2', name: 'Zapisnik sa sastanka', lastEdited: 'Pre 1 dan' },
    { id: '3', name: 'Ideja', lastEdited: 'Pre 3 dana' }
  ];

  constructor(private router: Router) {}

  createNewDocument() {
    const docId = 'doc-' + Date.now(); 
    this.router.navigate(['/editor', docId]);
  }

  openDocument(docId: string) {
    this.router.navigate(['/editor', docId]);
  }
}