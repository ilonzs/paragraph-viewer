import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Paragraph } from '../model/paragraph';
import { DocumentService } from '../services/document.service';


export class DocumentDataSource extends DataSource<Paragraph | undefined> {
  /**
   * Number of paragraphs in the entire document
   */
  private _length = -1;
  private _cachedData = Array.from<Paragraph>({length: 3});
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(Paragraph | undefined)[]>(this._cachedData);

  private _subscription = new Subscription();

  /**
   * Creates an instance of DocumentDataSource.
   * @param {DocumentService} _documentService Document service
   * @param {number} [_pageSize=100] Number of paragraphs to be loaded per page
   * @memberof DocumentDataSource
   */
  constructor(private _documentService: DocumentService, private _pageSize: number = 100) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(Paragraph | undefined)[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForElementIndex(range.start);
      const endPage = this.getPageForElementIndex(range.end - 1);
      this.cleanupCache(startPage, endPage);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  public getCacheLength() {
    return this._cachedData.length;
  }

  /**
   * Returns the page index (element chunk of length _pageSize)
   * for a given element index (the page where the element is in).
   * @private
   * @param {number} index Index of an element
   * @returns {number} Index of the page the element is in
   * @memberof DocumentDataSource
   */
  private getPageForElementIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  /**
   * Function to cleanup the cache.
   * Deletes every page except the startPage-endPage range.
   * @private
   * @param {number} startPage Start page index
   * @param {number} endPage End page index
   * @memberof DocumentDataSource
   */
  private cleanupCache(startPage: number, endPage: number) {
      // We only want to cache 2 pages
      if (this._fetchedPages.size >= 2) {
        const pagesToRemove = startPage === endPage ?
          Array.from(this._fetchedPages).filter(i => i < startPage - 1 || i > startPage + 1)
          : Array.from(this._fetchedPages).filter(i => i < startPage || i > endPage);

        pagesToRemove.forEach(i => {
            this._fetchedPages.delete(i);
            this._cachedData.splice(i * this._pageSize, this._pageSize,
              ...Array.from<Paragraph>({length: this._pageSize}));
          });
      }
  }

  /**
   * Method to fetch the pageIndex'th page.
   *
   * @private
   * @param {number} pageIndex Index of the page to fetch
   * @returns
   * @memberof DocumentDataSource
   */
  private async fetchPage(pageIndex: number) {
    if (this._length === -1) {
      this._length = await this._documentService.getDocumentLength();
      this._cachedData = Array.from<Paragraph>({length: this._length});
    }

    if (this._fetchedPages.has(pageIndex)) {
      return;
    }

    this._fetchedPages.add(pageIndex);
    const pageResult = await this._documentService.getDocument(pageIndex, this._pageSize);
    this._cachedData.splice(pageIndex * this._pageSize, this._pageSize,
        ...Array.from({length: this._pageSize}).map((_, i) => pageResult[i]));

    this._dataStream.next(this._cachedData);

  }
}
