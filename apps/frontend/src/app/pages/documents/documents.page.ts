import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { LoadingController, PopoverController } from '@ionic/angular';
import { LanguageService } from '../../services/language/language.service';

import { CountriesListPage } from '../countries-list/countries-list.page';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';
import { NotificationService } from 'src/app/services/notification/notification.service';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  submitForm: FormGroup;
  filePassportPhoto: Blob | undefined;
  filePassportPhotoName = '';
  fileIDCard: Blob | undefined;
  fileIDCardName = '';
  fileDriversLicencePhoto: Blob | undefined;
  fileDriversLicencePhotoName = '';
  selectedCountryNationality: any;
  selectedCountryCitizenship: any;
  inputTheme: boolean = document.body.classList.contains('dark-theme')
    ? false
    : true;
  showSubmitCard: boolean = localStorage.getItem('documentId') ? true : false;
  waitingResponse: boolean = false;
  passportPhotoUrl: string = '../../../assets/img/photo-placeholder.png';

  constructor(
    private formBuilder: FormBuilder,
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService,
    private loadingController: LoadingController
  ) {
    this.submitForm = this.formBuilder.group(
      {
        filePassportPhoto: ['', Validators.required],
        firstName: ['', Validators.required],
        paternalSurname: ['', Validators.required],
        maternalSurname: ['', Validators.required],
        gender: ['', Validators.required],
        nativity: ['', Validators.required],
        countryNationality: ['', Validators.required],
        countryCitizenship: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        cityOfBirth: ['', Validators.required],
        addressResidency: ['', Validators.required],
        addressDomicile: ['', Validators.required],
        idPassport: ['', Validators.required],
        driversLicenceNumber: [''],
        notes: [''],
        fileIDCard: ['', Validators.required],
        fileDriversLicencePhoto: [''],
      },
      {
        validator: this.driversLicenceValidator(
          'driversLicenceNumber',
          'fileDriversLicencePhoto'
        ),
      }
    );
  }

  ngOnInit() {
    this.inputTheme = document.body.classList.contains('dark-theme')
      ? false
      : true;
  }

  onPhotoSelect(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.passportPhotoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.filePassportPhotoName = file.name as string;
    this.filePassportPhoto = new Blob([file], { type: file.type });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDropFileIDCard(event: any) {
    event.preventDefault();
    this.fileIDCard = event.dataTransfer.files[0];
  }

  onDropDriversLicencePhoto(event: any) {
    event.preventDefault();
    this.fileDriversLicencePhoto = event.dataTransfer.files[0];
  }

  onFileIDCardSelect(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.fileIDCardName = file.name as string;
    this.fileIDCard = new Blob([file], { type: file.type });
  }

  onFileDriversLicencePhotoSelect(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.fileDriversLicencePhotoName = file.name as string;
    this.fileDriversLicencePhoto = new Blob([file], { type: file.type });
  }

  selectFileIDCard() {
    const element = document.getElementById('fileInputIDCard');
    if (element !== null) {
      element.click();
    }
  }

  selectFileDriversLicencePhoto() {
    const element = document.getElementById('fileInputDriversLicencePhoto');
    if (element !== null) {
      element.click();
    }
  }

  async openLoader() {
    this.waitingResponse = true;

    const loading = await this.loadingController.create({
      message: 'Your document is being uploaded...',
      duration: 0,
    });
    await loading.present();

    while (this.waitingResponse) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await loading.dismiss();
  }

  async submit() {
    if (
      !this.fileIDCard ||
      this.submitForm.invalid ||
      !this.selectedCountryNationality ||
      !this.selectedCountryCitizenship
    ) {
      if (this.submitForm.invalid)
        this.notificationService.showNotification(
          'Invalid Form',
          2000,
          'bottom',
          'danger'
        );
      if (!this.fileIDCard)
        this.notificationService.showNotification(
          'Please select a file',
          2000,
          'bottom',
          'danger'
        );
      return;
    }

    const formValue = this.submitForm.value;
    const formData = new FormData();
    formData.append(
      'filePassportPhoto',
      this.filePassportPhoto as Blob,
      this.filePassportPhotoName as string
    );
    formData.append('firstName', formValue.firstName);
    formData.append('paternalSurname', formValue.paternalSurname);
    formData.append('maternalSurname', formValue.maternalSurname);
    formData.append('sex', formValue.gender);
    formData.append('nativity', formValue.nativity);
    formData.append('countryNationality', this.selectedCountryNationality);
    formData.append('countryCitizenship', this.selectedCountryCitizenship);
    formData.append('dateOfBirth', formValue.dateOfBirth);
    formData.append('cityOfBirth', formValue.cityOfBirth);
    formData.append('addressResidency', formValue.addressResidency);
    formData.append('addressDomicile', formValue.addressDomicile);
    formData.append('idPassport', formValue.idPassport);
    formData.append('driversLicenceNumber', formValue.driversLicenceNumber);
    formData.append('notes', formValue.notes);
    formData.append(
      'fileIDCard',
      this.fileIDCard as Blob,
      this.fileIDCardName as string
    );
    if (this.fileDriversLicencePhoto) {
      formData.append(
        'fileDriversLicencePhoto',
        this.fileDriversLicencePhoto as Blob,
        this.fileDriversLicencePhotoName as string
      );
    }

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await axios.post(
        `${environment.backendUrl}/documents/upload`,
        formData,
        config
      );
      console.log('Document created:', response.data);
      this.notificationService.showNotification(
        'Form submitted',
        3000,
        'bottom',
        'success'
      );

      //save the document id in local storage
      localStorage.setItem('documentId', response.data._id);

      // Disable the form and show the card
      this.submitForm.disable();
      this.waitingResponse = false;
      this.showSubmitCard = true;
    } catch (error: any) {
      console.error(
        'Error creating document:',
        error.response ? error.response.data : error.message,
        formData
      );
      this.notificationService.showNotification(
        'Error submitting form',
        3000,
        'bottom',
        'danger'
      );
      this.waitingResponse = false;
    }
  }

  async openLanguagePopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev,
    });
    await popover.present();
  }

  async openCountriesPopoverNationality(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: CountriesListPage,
      event: ev,
      translucent: true,
      cssClass: 'countries-popover',
    });

    popover.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.selectedCountryNationality = data.data;
      }
    });

    await popover.present();
  }

  async openCountriesPopoverCitizenship(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: CountriesListPage,
      event: ev,
      translucent: true,
      cssClass: 'countries-popover',
    });

    popover.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.selectedCountryCitizenship = data.data;
      }
    });

    await popover.present();
  }

  driversLicenceValidator(
    driversLicenceNumberKey: string,
    fileDriversLicencePhotoKey: string
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const driversLicenceNumberControl = control.get(driversLicenceNumberKey);
      const fileDriversLicencePhotoControl = control.get(
        fileDriversLicencePhotoKey
      );

      if (!driversLicenceNumberControl || !fileDriversLicencePhotoControl) {
        return null;
      }

      const driversLicenceNumberValue = driversLicenceNumberControl.value;
      const fileDriversLicencePhotoValue = fileDriversLicencePhotoControl.value;

      if (driversLicenceNumberValue && !fileDriversLicencePhotoValue) {
        return { fileRequiredIfDriverLicenseNumberProvided: true };
      }

      if (!driversLicenceNumberValue && fileDriversLicencePhotoValue) {
        return { fileRequiredIfDriverLicenseNumberProvided: true };
      }

      return null;
    };
  }
}
