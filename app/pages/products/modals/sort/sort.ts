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
        name: 'Preço',
        suboptions: [
          {name: 'Mais Barato', value: 'price'},
          {name: 'Mais Caro', value: '-price'}
        ]
      },
      {
        name: 'Estoque',
        suboptions: [
          {name: 'Maior Estoque', value: '-stock_avaible'},
          {name: 'Menor Estoque', value: 'stock_avaible'}
        ]
      },
      {
        name: 'Data de Cadastro',
        suboptions: [
          {name: 'Cadastrados Mais Recentemente', value: '-created_at'},
          {name: 'Cadastrados Mais Anteriormente', value: 'created_at'}
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
    console.log('changed', this.selectedSort);
    if (this.selectedSort != {} && this.selectedSort != this.params.get('sort')) {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.selectedSort);
  }
}
