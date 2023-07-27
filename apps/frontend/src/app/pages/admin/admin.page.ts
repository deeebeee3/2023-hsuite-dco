import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AdminFormPage } from './modal/admin-form/admin-form.page';
import axios from 'axios';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  documents: any[] = [];
  filteredDocuments: any[] = [];
  documentImg: string = '../../assets/img/document.png';
  documentsFilter: boolean = true;
  PendingDocs: number = 0;
  filterBy: "none" | "APPROVED" | "PENDING" | "REJECTED" = "none";
  
  ngOnInit() {
    this.getDocumentList()
      .then((documents: any) => {
        this.documents = documents;
        this.filteredDocuments = this.documents;
        console.log(this.documents);
        this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length; // Calculate PendingDocs here
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  

  reloadDocuments() {
    this.getDocumentList()
    .then((documents: any) => {
      this.documents = documents;
      this.filteredDocuments = this.documents;
      console.log(this.documents);
    })
    .catch((error: any) => {
      console.log(error);
    });
  }

  async getDocumentList(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try{
        let response = await axios.get(`${environment.backendUrl}/documents`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status === 200) resolve(response.data);
      }catch(error){
        reject(error);
      }
    });
  }

  searchDocuments(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filterBy = 'none';
    this.filteredDocuments = this.documents.filter(doc => doc.hash.toLowerCase().includes(searchTerm));
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'medium';
    }
  }

  async openConfirmationDialog(document: any) {
    const alert = await this.alertController.create({
      header: 'Review Document',
      message: `<img src="${this.documentImg}" alt="g-maps" style="border-radius: 2px">`,
      buttons: [
        {
          text: 'Reject',
          handler: () => {
            this.reloadDocuments()
            this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
            // this.listSorter(document);
          }
        }, {
          text: 'Approve',
          handler: () => {
            this.openDocumentModal(document);
            this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
            // this.listSorter(document);
          }
        }
      ],
      // backdropDismiss: false,
    });
    await alert.present();
  }

  async openChangeStatusDialog(document: any) {
    const buttons = [];
    buttons.push({
      text: 'Pending',
      handler: () => {
        this.reloadDocuments();
        this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
        // this.listSorter(document);
      }
    });
    if (document.status !== 'APPROVED') {
      buttons.push({
        text: 'Approve',
        handler: () => {
          this.reloadDocuments();
          this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
          // this.listSorter(document);
        }
      });
    }
    if (document.status !== 'REJECTED') {
      buttons.push({
        text: 'Reject',
        handler: () => {
          this.reloadDocuments()
          this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
        }
      });
    }
    const alert = await this.alertController.create({
      header: 'Change Status',
      message: `<img src="${this.documentImg}" alt="g-maps" style="border-radius: 2px">`,
      buttons
    });

    await alert.present();
  }


  changeDocumentStatus(document: any) {
    if (document.status === 'PENDING') {
      this.openConfirmationDialog(document);
    } else {
      this.openChangeStatusDialog(document);
    }
  }

  listSorter(document: any) {
    return this.filteredDocuments = this.documents.sort((a, b) => {
      if (a.status === 'PENDING') {
        return -1;
      } else if (a.status === 'REJECTED') {
        if (b.status === 'PENDING') {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 1;
      }
    });
  }

  filterDocuments(status: 'APPROVED' | 'PENDING' | 'REJECTED') {
    if (this.filterBy === status) {
      this.filteredDocuments = this.documents;
      this.filterBy = 'none';
    } else {
      this.filteredDocuments = this.documents.filter(doc => doc.status === status);
      this.filterBy = status;
    }
  }


  async openDocumentModal(document: any) {
    // modal will be opened here for the admin fill in the information
    console.log(document);
    const modal = await this.modalController.create({
      component: AdminFormPage,
      componentProps: {
        document
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.reloadDocuments();
      this.PendingDocs = this.documents.filter(doc => doc.status === 'PENDING').length;
      // this.listSorter(document);
    }
  }
}

