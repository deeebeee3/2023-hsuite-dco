import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.page.html',
  styleUrls: ['./countries-list.page.scss'],
})
export class CountriesListPage {

  countries: any = [];
  searchQuery: string = '';
  selectedCountry: any = {};

  constructor(private http: HttpClient,private popoverCtrl: PopoverController) {
    this.loadCountries();
  }

  loadCountries() {
    this.http.get('assets/countries.json').subscribe((data: any) => {
      this.countries = data;
    });
  }

  select(country: any) {
    this.popoverCtrl.dismiss(country);
  }



  filterCountries() {
    this.http.get('assets/countries.json').subscribe((data: any) => {
      this.countries = data.filter((country: any) => {
        return country.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      });
    });
  }

}
