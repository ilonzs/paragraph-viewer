import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Paragraph } from '../../model/paragraph';
import { DocumentService } from '../../services/document.service';
import { DocumentDataSource } from '../../data/document.data-source';
import { MessageBarService } from 'src/app/material/services/message-bar.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements AfterViewInit {

  paragraphs: DocumentDataSource;
  @ViewChild('documentViewPort') documentViewPort: CdkVirtualScrollViewport;

  constructor(
    private _documentService: DocumentService,
    private _messageService: MessageBarService) {
    this.paragraphs = new DocumentDataSource(
      this._documentService,
      this._messageService,
      200);
  }

  /**
   * Custom trackBy function to let *ngFor track the
   * PharagraphComponents by their id
   */
  public paragraphTrackBy(_, item: Paragraph) {
    if (!item) { return null; }
    return item.id;
  }

  ngAfterViewInit() {
    this.paragraphs.setViewPort(this.documentViewPort);
  }

}
