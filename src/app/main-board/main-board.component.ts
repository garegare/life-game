import { Component, OnInit } from '@angular/core';
import { SettingService, IBoardSize } from '../setting.service';

// 盤面
class Board {
  cells: Cell[][];

  constructor(row: number, col: number) {
    this.cells = new Array<Cell[]>(row);
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array<Cell>(col);
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j] = new Cell();
      }
    }
  }

  // ランダム配置
  makeRandomCellLife() {
    this.cells.forEach((rows) => {
      rows.forEach((cell: Cell) => {
        const val = Math.floor(Math.random() * Math.floor(2));
        cell.setValue(val);
      });
    });
  }

  // 指定したセルの周辺3*3を取得
  getAroundCells(i: number, j: number): Cell[][] {
    const ret = new Array<Cell[]>(3);
    ret[0] = new Array<Cell>(3);
    ret[1] = new Array<Cell>(3);
    ret[2] = new Array<Cell>(3);
    ret[0][0] = this.cells[i - 1] !== undefined && this.cells[i - 1][j - 1] !== undefined ? this.cells[i - 1][j - 1] : null;
    ret[0][1] = this.cells[i - 1] !== undefined && this.cells[i - 1][j] !== undefined ? this.cells[i - 1][j] : null;
    ret[0][2] = this.cells[i - 1] !== undefined ? this.cells[i - 1][j + 1] : null;
    ret[1][0] = this.cells[i] !== undefined && this.cells[i][j - 1] !== undefined ? this.cells[i][j - 1] : null;
    ret[1][1] = null;
    ret[1][2] = this.cells[i] !== undefined && this.cells[i][j + 1] !== undefined ? this.cells[i][j + 1] : null;
    ret[2][0] = this.cells[i + 1] !== undefined && this.cells[i + 1][j - 1] !== undefined ? this.cells[i + 1][j - 1] : null;
    ret[2][1] = this.cells[i + 1] !== undefined && this.cells[i + 1][j] !== undefined ? this.cells[i + 1][j] : null;
    ret[2][2] = this.cells[i + 1] !== undefined && this.cells[i + 1][j + 1] !== undefined ? this.cells[i + 1][j + 1] : null;
    return ret;
  }

  // 3*3中の生存セルの数を取得
  getAroundLivingCellNum(i: number, j: number): number {
    const cells = this.getAroundCells(i, j);
    let livec = 0;
    cells.forEach(rows => {
      rows.forEach((c: Cell) => {
        if (c != null) {
          if (c.isLiving()) {
            livec++;
          }
        }
      });
    });
    return livec;
  }
}

// セル
class Cell {

  private value: number;

  constructor() {
    this.value = 0;
  }

  // 生存しているかどうかを取得
  isLiving(): boolean {
    if (this.value === 0) {
      return false;
    } else {
      return true;
    }
  }

  // 値を設定
  setValue(val: number) {
    this.value = val;
  }

  // 値を取得
  getValue(): number {
    return this.value;
  }
}

@Component({
  selector: 'app-main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent implements OnInit {

  boardSize: IBoardSize;
  board: Board;

  constructor(
    private settingService: SettingService
  ) {
    this.boardSize = this.settingService.getBoardSize();
    this.board = new Board(this.boardSize.row, this.boardSize.col);
    this.board.makeRandomCellLife();
  }

  ngOnInit() {
    setInterval(this.nextStep.bind(this), 1000);
  }

  // 世代交代
  nextStep() {
    const next: Board = new Board(this.boardSize.row, this.boardSize.col);
    next.cells.forEach((row: Cell[], i: number) => {
      row.forEach((cell: Cell, j: number) => {
        const livingCellNum = this.board.getAroundLivingCellNum(i, j);
        cell.setValue(this.board.cells[i][j].getValue());
        if (cell.isLiving()) {
          this.live(cell, livingCellNum);
          this.depopulation(cell, livingCellNum);
          this.overpopulation(cell, livingCellNum);
        } else {
          this.birth(cell, livingCellNum);
        }
      });
    });
    this.board = next;
  }

  // 生誕
  birth(cell: Cell, livec: number){
    if (livec === 3) {
      cell.setValue(1);
    }
  }

  // 生存
  live(cell: Cell, livec: number) {
    if (livec === 3 || livec === 2) {
      cell.setValue(1);
    }
  }

  // 過疎
  depopulation(cell: Cell, livec: number) {
    if (livec <= 1) {
      cell.setValue(0);
    }
  }

  // 過密
  overpopulation(cell: Cell, livec: number) {
    if (livec >= 4) {
      cell.setValue(0);
    }
  }
}
