import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguagePopoverPage } from '../language-popover/language-popover.page';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  documents: { id: string, status: string }[] = [
    { id: 'ABC123', status: 'pending' },
    { id: 'DEF456', status: 'rejected' },
    { id: 'GHI789', status: 'approved' },
    { id: 'JKL012', status: 'pending' }
  ];
  filteredDocuments: { id: string, status: string }[] = this.documents;

  constructor(private popoverCtrl: PopoverController,) { }

  ngOnInit() {
  }

  searchDocuments(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredDocuments = this.documents.filter(doc =>
      doc.id.toLowerCase().includes(searchTerm) ||
      doc.status.toLowerCase().includes(searchTerm)
    );
  }

  async openLanguagePopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopoverPage,
      event: ev,
    });
    await popover.present();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      case 'approved':
        return 'success';
      default:
        return 'medium';
    }
  }

}
