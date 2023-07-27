import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private languageService: LanguageService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.translate.setDefaultLang('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authService.isAuthenticated().then((authenticated: any) => {
        if (!authenticated && this.router.url !== '/login') {
          this.router.navigate(['/login']);
        } else this.router.navigate(['/tabs']);
      });
    });
    this.languageService.setInitialAppLanguage();
  }
}
