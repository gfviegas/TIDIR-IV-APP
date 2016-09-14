import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/sellers/modals/sort/sort.html',
})
export class SortModalPage {
  selectedSort: any = {};
  options;

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.selectedSort = params.get('sort');

    this.options = [
      {
        name: 'Data de Cadastro',
        suboptions: [
          {name: 'Cadastrados Mais Recentemente', value: '-date'},
          {name: 'Cadastrados Mais Anteriormente', value: 'date'}
        ]
      },
      {
        name: 'Ordem Alfabética',
        suboptions: [
          {name: 'A-Z', value: 'name'},
          {name: 'Z-A', value: '-name'}
        ]
      },
    ]
  }

  cancel() {
    this.selectedSort = {};
    this.dismiss();
  }

  select() {
    if (this.selectedSort != {} && this.selectedSort != this.params.get('sort')) {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.selectedSort);
  }
}
