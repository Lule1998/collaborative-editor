import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: any;
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();

  connect(docId: string) {
    this.socket$ = webSocket('ws://localhost:8080');
    
    this.socket$.subscribe({
      next: (message: any) => this.messageSubject.next(message),
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });

    this.sendMessage({ type: 'join', docId });
  }

  sendMessage(message: any) {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  close() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}