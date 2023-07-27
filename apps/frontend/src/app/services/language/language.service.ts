import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

const LANG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  selected = '';

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    ) {
    this.storage.create();
  }

  setInitialAppLanguage() {

    // let language = this.translate.getBrowserLang();
    // this.translate.setDefaultLang(language);

    this.translate.setDefaultLang('en');

    this.storage.get(LANG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en'},
      { text: 'Español', value: 'es'},
      { text: 'Português', value: 'pt'},
    ];
  }

  async setLanguage(lng: any) {
    await this.storage.set(LANG_KEY, lng);
    this.selected = lng;
    this.translate.use(lng);
  }




}
