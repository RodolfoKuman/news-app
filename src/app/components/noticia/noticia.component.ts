import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';
import { ActionSheetController, ToastController } from '@ionic/angular';

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: "app-noticia",
  templateUrl: "./noticia.component.html",
  styleUrls: ["./noticia.component.scss"]
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() indice: number[];
  @Input() enFavoritos;

  constructor(
      private iab: InAppBrowser,
	  private actionSheetCtrl: ActionSheetController,
	  private socialSharing : SocialSharing,
      private dataLocalService : DataLocalService,
      private toastController : ToastController
    ) {}

    async presentToast(message : string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000
        });
        toast.present();
    }

  ngOnInit() {}

  abrirNoticia() {
      const browser = this.iab.create(this.noticia.url, "_system");
  }

  async lanzarMenu(){

      let guardarBorrarBtn;

      if(this.enFavoritos){
          guardarBorrarBtn = {
              text: 'Borrar favorito',
              icon: 'trash-bin-outline',
              cssClass: 'action-dark',
              handler: () => {
                  console.log('Borrar Favorito clicked');
                  this.dataLocalService.borrarNoticia(this.noticia);
                  this.presentToast('Borrado de favoritos');             
              }
          }
      }else{
          guardarBorrarBtn = {
            text: 'Favorito',
            icon: 'star-outline',
            cssClass: 'action-dark',
            handler: () => {
                console.log('Favorito clicked');
                this.dataLocalService.guardarNoticia(this.noticia);
                this.presentToast('Guardado favoritos');  
            }
          }
      }

      const actionSheet = await this.actionSheetCtrl.create({
          buttons: [ 
			{
                text: 'Compartir',
                icon: 'share-social-outline',
                cssClass: 'action-dark',
                handler: () => {
                    console.log('Share clicked');
                    this.socialSharing.share(
                        this.noticia.title,
                        this.noticia.source.name,
                        '',
                        this.noticia.url
                    );
                },
            }, 
              guardarBorrarBtn,
			 {
				text: 'Cancelar',
				icon: 'close',
				cssClass: 'action-dark',
				role: 'cancel',
				handler: () => {
					console.log('Cancelar clicked');
				}
			}]
      });
      await actionSheet.present();
  }

}
