import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { CountriesListPage } from '../../../countries-list/countries-list.page';
import { NotificationService } from 'src/app/services/notification/notification.service';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.page.html',
  styleUrls: ['./admin-form.page.scss'],
})
export class AdminFormPage implements OnInit {
  @Input() document: any;

  submitForm: FormGroup;
  selectedCountry: any;
  waitingResponse: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private popoverCtrl: PopoverController,
    private notificationService: NotificationService,
    private modalController: ModalController,
    private loadingController: LoadingController
    ) {
    this.submitForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      cityOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      notes: [''],
      certified_Hash: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async changeDocumentStatus(): Promise<any> {
    if (this.submitForm.invalid || !this.selectedCountry) {
      if (this.submitForm.invalid) this.notificationService.showNotification('Invalid Form', 2000, 'bottom', 'danger');
      return;
    }

    try {

      const formValue = this.submitForm.value;
      const formData = {
        status: 'APPROVED',
        hash: this.document.hash,
        certified_Hash: formValue.certified_Hash,
        address: formValue.address,
        country: this.selectedCountry,
        dateOfBirth: formValue.dateOfBirth,
        gender: formValue.gender,
        name: formValue.name,
        surname: formValue.surname,
        notes: formValue.notes,
      };

      const response = await axios.patch(`${environment.backendUrl}/documents/set-status`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.waitingResponse = false;
      this.modalController.dismiss();
      this.notificationService.showNotification('Document successfully approved!', 2000, 'bottom', 'success');
      return response.data;
    } catch (error: any) {
      this.waitingResponse = false;
      this.notificationService.showNotification('Failed to change document status', 2000, 'bottom', 'danger');
    }
  }

  async openCountriesPopover(ev:any) {
    const popover = await this.popoverCtrl.create({
      component: CountriesListPage,
      event: ev,
      translucent: true,
      cssClass: 'countries-popover',
    });

    popover.onDidDismiss().then((data) => {
      if (data && data.data) {
        this.selectedCountry = data.data;
      }
    });

    await popover.present();
  }

  async openLoader() {
    this.waitingResponse = true;

    const loading = await this.loadingController.create({
      message: 'The document is being updated...',
      duration: 0
    });
    await loading.present();

    while (this.waitingResponse) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await loading.dismiss();
  }

}
