import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  
  selected:string;
  homePage:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  
  ionViewWillEnter(){
    this.homePage = this.navParams.get("homePage");
  }
  
  ionViewDidEnter(){
    this.homePage.getOptions().then((opt) => {
      this.selected = opt || 'primary';
    });
  }

  select(card:string):void{
    this.selected = card;
  }


  ionViewWillUnload(){
    this.homePage.setMenuSelected(this.selected);
    this.homePage.init();
  }
}
