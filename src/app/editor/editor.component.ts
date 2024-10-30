import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../services/websocket.service';
import { CRDT } from '../models/crdt';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() docId!: string;
  text = '';
  private crdt!: CRDT;

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    const siteId = Math.random().toString(36).substring(7);
    this.crdt = new CRDT(siteId);
    this.wsService.connect(this.docId);
    this.wsService.messages$.subscribe(this.handleMessage.bind(this));
  }

  ngOnDestroy() {
    this.wsService.close();
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'init':
        this.crdt.struct = data.state;
        this.text = this.crdt.getValue();
        break;
      case 'operation':
        if (data.operation.type === 'insert') {
          this.crdt.remoteInsert(data.operation.char);
        } else {
          this.crdt.remoteDelete(data.operation.char);
        }
        this.text = this.crdt.getValue();
        break;
    }
  }

  handleChange(newValue: string) {
    const diff = this.findDiff(this.text, newValue);
    let operation;

    if (diff.type === 'insert') {
      operation = this.crdt.localInsert(diff.char || '', diff.index);
    } else {
      operation = this.crdt.localDelete(diff.index);
    }

    this.wsService.sendMessage({
      type: 'operation',
      operation
    });

    this.text = newValue;
  }

  private findDiff(oldStr: string, newStr: string) {
    if (newStr.length > oldStr.length) {
      for (let i = 0; i < oldStr.length; i++) {
        if (oldStr[i] !== newStr[i]) {
          return { type: 'insert', char: newStr[i], index: i };
        }
      }
      return {
        type: 'insert',
        char: newStr[newStr.length - 1],
        index: newStr.length - 1
      };
    } else {
      for (let i = 0; i < newStr.length; i++) {
        if (oldStr[i] !== newStr[i]) {
          return { type: 'delete', index: i };
        }
      }
      return {
        type: 'delete',
        index: oldStr.length - 1
      };
    }
  }
}