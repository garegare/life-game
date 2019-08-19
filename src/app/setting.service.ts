import { Injectable } from '@angular/core';

export interface IBoardSize {
  row: number;
  col: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private rowNum: number;
  private colNum: number;

  constructor() {
    this.colNum = 16;
    this.rowNum = 16;
  }

  getBoardSize(): IBoardSize {
    return {
      row: this.rowNum,
      col: this.colNum
    };
  }
}
