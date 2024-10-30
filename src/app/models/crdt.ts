export class Char {
    constructor(
      public value: string,
      public pos: number[],
      public siteId: string,
      public deleted: boolean = false
    ) {}
  }
  
  export class CRDT {
    struct: Char[] = [];
    
    constructor(private siteId: string) {}
    
    generatePosBetween(prev: number[] | null, next: number[] | null): number[] {
      if (!prev) return [next ? next[0] - 1 : 1];
      if (!next) return [prev[prev.length - 1] + 1];
      
      const diff = next[0] - prev[prev.length - 1];
      return diff > 1 
        ? [prev[prev.length - 1] + Math.floor(diff / 2)]
        : [...prev, 1];
    }
  
    localInsert(value: string, index: number) {
      const char = this.insert(value, index);
      return { type: 'insert', char };
    }
  
    remoteInsert(char: Char): number {
      let index = 0;
      while (index < this.struct.length && this.comparePos(this.struct[index].pos, char.pos)) {
        index++;
      }
      this.struct.splice(index, 0, char);
      return index;
    }
  
    insert(value: string, index: number): Char {
      const pos = this.generatePosBetween(
        this.struct[index - 1]?.pos || null,
        this.struct[index]?.pos || null
      );
      const char = new Char(value, pos, this.siteId);
      this.struct.splice(index, 0, char);
      return char;
    }
  
    localDelete(index: number) {
      const char = this.struct[index];
      char.deleted = true;
      return { type: 'delete', char };
    }
  
    remoteDelete(char: Char): number {
      const index = this.findIndexByPosition(char.pos);
      if (index !== -1) {
        this.struct[index].deleted = true;
      }
      return index;
    }
  
    private comparePos(pos1: number[], pos2: number[]): boolean {
      for (let i = 0; i < Math.min(pos1.length, pos2.length); i++) {
        if (pos1[i] !== pos2[i]) return pos1[i] < pos2[i];
      }
      return pos1.length < pos2.length;
    }
  
    private findIndexByPosition(pos: number[]): number {
      return this.struct.findIndex(char => 
        char.pos.length === pos.length && 
        char.pos.every((p, i) => p === pos[i])
      );
    }
  
    getValue(): string {
      return this.struct
        .filter(char => !char.deleted)
        .map(char => char.value)
        .join('');
    }
  }
  