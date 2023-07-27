import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.page.html',
  styleUrls: ['./language-popover.page.scss'],
})
export class LanguagePopoverPage implements OnInit {
  languages: { text: string; value: string; }[] = [];
  selected = '';

  constructor(private popoverCtrl: PopoverController, private languageService: LanguageService) { }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  select(lang: any) {
    console.log('language selected:', lang);
    this.languageService.setLanguage(lang);
    this.popoverCtrl.dismiss();
  }

}
