import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {

  isDarkMode: boolean = false;

  ngOnInit() {
    // Check if the initial color theme is dark
    const body = document.body;
    if (body) {
      this.isDarkMode = body.classList.contains('dark-theme');
    }

    // Check if theme preference is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDarkMode = storedTheme === 'dark';
      this.setTheme(this.isDarkMode);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.setTheme(this.isDarkMode);

    // Store theme preference in localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private setTheme(isDark: boolean) {
    const body = document.body;
    if (body) {
      body.classList.toggle('dark-theme', isDark);
    }
  }
}
