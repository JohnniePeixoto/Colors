import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Toast } from '@ionic-native/toast';
import { Http } from '@angular/http';
import { Vibration } from '@ionic-native/vibration';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  COLORS_KEY = 'colors';
  allColors:any= [];
  selectedColors:any= [];
  menuSelected:string;
  index:number = 0;
  isSpeaking = false;
  isSwipe:boolean = false;
  menuPage = MenuPage;

  constructor(
    public navCtrl: NavController,
    private tts: TextToSpeech,
    private toast: Toast,
    private http: Http,
    private platform: Platform,
    private vibration: Vibration,
    private storage: Storage
  ) {
    this.http.get('assets/data/colors.json')
      .subscribe(data => {
        this.allColors = data.json();
        this.init();
      });
      platform.ready().then(() => { 
        platform.registerBackButtonAction(() => {
          this.showToast('Para sair pressione o botão Home',2500,'bottom');
        });
    });
  }

  init():void{
    this.selectedColors = [];
    this.getOptions().then((option) => {
      this.menuSelected = option || 'primary';
      this.showToast(this.menuSelected);
      switch(this.menuSelected){
        case 'initial': this.selectedColors = this.allColors.initial; break;
        case 'advanced': this.selectedColors = this.allColors.advanced; break;
        default: this.selectedColors = this.allColors.primary; break;
      }
      console.log(this.selectedColors.length);
      this.index = 0; //Seta a primeira cor a ser exibida
    });
  }

  openMenu(open:boolean):void{
    if(!open)
      this.showToast('Presione o menu por 3 segundos para acessá-lo');
    else
      this.navCtrl.push(MenuPage, {"homePage":this});
  }
  
  setMenuSelected(menuOption:string):void{
    this.setOptions(menuOption);
    this.menuSelected = menuOption;
  }

  vibrate():void{
    this.vibration.vibrate(40);
  }

  voice():void{
    if(this.isSpeaking) return;
    if(this.isSwipe){
      this.isSwipe = false;
    } else {
      try{
        this.say(this.selectedColors[this.index].audio);
        this.showToast(this.selectedColors[this.index].name.toUpperCase());
      }catch(e){
        console.log(e);
      };
    }
  }

  say(text):void{
    this.isSpeaking = true;
    this.tts.speak({text: text, locale: 'pt-BR', rate: 0.75})
      .then(() => this.isSpeaking = false);
  }

  showToast(text, duration=2000, position='center'):void{
    console.log(text.toUpperCase());
    this.toast.showWithOptions({
      message:text,
      duration:duration,
      position:position,
      styling: {
        backgroundColor: '#F5F5F5',
        textColor: '#000000',
        cornerRadius: 40
      }
    }).subscribe(
      toast => console.log('Toast success')
    );
  }

  changePage($event):void{
    if($event.distance > 70){
      this.isSwipe = true;
      this.stopActions();
      if($event.direction === 2){
        this.direita();
        console.log("changePage direita");
      } else if($event.direction === 4){
        this.esquerda();
        console.log("changePage esquerda");
      }
      this.isSwipe = false;
    }
  }

  stopActions():void{
    this.toast.hide();
    this.tts.speak({text: ''});
  }

  direita():void{
    if(this.index === (this.selectedColors.length - 1)){
      this.index = 0;
    } else {
      this.index++;
    }
  }

  esquerda():void{
    if(this.index === 0){
      this.index = this.selectedColors.length - 1;
    } else {
      this.index--;
    }
  }

  setOptions(opt:string):Promise<any>{
    return this.storage.set(this.COLORS_KEY, opt);
  }
  getOptions():Promise<any>{
    return this.storage.get(this.COLORS_KEY);
  }
}
