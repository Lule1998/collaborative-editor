// websocket.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<string>();
  public messages$: Observable<string> = this.messagesSubject.asObservable();

  constructor() {}

  poveziSeNaServer(docId: string): void {
    // Koristi stvarni WebSocket URL za tvoj server
    const wsUrl = `ws://localhost:3000/doc/${docId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket konekcija uspostavljena');
    };

    this.ws.onmessage = (event) => {
      console.log('Primljena poruka:', event.data);
      this.messagesSubject.next(event.data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket greška:', error);
      this.messagesSubject.error(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket konekcija zatvorena');
      this.messagesSubject.complete();
    };
  }

  posaljiPoruku(poruka: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const porukaPaket = JSON.stringify({
          tip: 'SADRZAJ_PROMENJEN',
          sadrzaj: poruka,
          timestamp: new Date().toISOString()
        });
        
        this.ws.send(porukaPaket);
      } catch (error) {
        console.error('Greška pri slanju poruke:', error);
      }
    } else {
      console.warn('WebSocket konekcija nije otvorena');
    }
  }

  zatvoriKonekciju(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Helper metode
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  reconnect(docId: string): void {
    this.zatvoriKonekciju();
    this.poveziSeNaServer(docId);
  }
}