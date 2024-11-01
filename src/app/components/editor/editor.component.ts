// editor.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-container">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="left">
          <h2 class="title">Collaborative Editor</h2>
          <span class="document-id">Document ID: {{docId}}</span>
        </div>
        <div class="right">
          <span class="status" [class.status-connected]="connectionStatus === 'Povezano'">
            <span class="status-dot"></span>
            {{ connectionStatus }}
          </span>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="editor-wrapper">
        <textarea
          class="editor-textarea"
          [(ngModel)]="content"
          (input)="handleInput($event)"
          placeholder="Start typing here..."
        ></textarea>
      </div>

      <!-- Footer -->
      <div class="editor-footer">
        <div class="character-count">
          Characters: {{ content.length }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      max-width: 1200px;
      margin: 2rem auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .document-id {
      font-size: 0.875rem;
      color: #6c757d;
      padding: 0.25rem 0.5rem;
      background: #e9ecef;
      border-radius: 4px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: #f1f3f5;
      font-size: 0.875rem;
      color: #495057;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #dc3545;
    }

    .status-connected .status-dot {
      background: #28a745;
    }

    .editor-wrapper {
      padding: 1.5rem;
    }

    .editor-textarea {
      width: 100%;
      min-height: 500px;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
      font-size: 1rem;
      line-height: 1.5;
      resize: vertical;
      background: #fff;
    }

    .editor-textarea:focus {
      outline: none;
      border-color: #4dabf7;
      box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
    }

    .editor-footer {
      display: flex;
      justify-content: flex-end;
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .character-count {
      font-size: 0.875rem;
      color: #6c757d;
    }
  `]
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() docId!: string;
  content: string = '';
  connectionStatus: string = 'Povezivanje...';

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.poveziSeNaServer(this.docId);
    
    // Pretplata na promene sadržaja od drugih korisnika
    this.wsService.messages$.subscribe({
      next: (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.tip === 'SADRZAJ_PROMENJEN' && data.sadrzaj !== this.content) {
            this.content = data.sadrzaj;
          }
        } catch (error) {
          console.error('Greška pri parsiranju poruke:', error);
        }
      },
      error: (error: any) => {
        console.error('WebSocket greška:', error);
        this.connectionStatus = 'Greška u konekciji';
      }
    });

    this.connectionStatus = 'Povezano';
  }

  ngOnDestroy(): void {
    this.wsService.zatvoriKonekciju();
  }

  handleInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.content = textarea.value;
    this.wsService.posaljiPoruku(this.content);
  }
}