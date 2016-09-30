import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'sort.html',
})
export class ProductsSortModalPage {
  selectedSort: any = {};
  options;

  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
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
          {name: 'Mais Novos', value: '-created_at'},
          {name: 'Mais Antigos', value: 'created_at'}
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
