import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Paragraph } from '../model/paragraph';
import { DocumentService } from '../services/document.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MessageBarService } from 'src/app/material/services/message-bar.service';

enum RefreshType {
  None,
  Up,
  Down
}

/**
 * An instance of this class represents a DataSource of large documents
 * constinging of paragraphs.
 */
export class DocumentDataSource extends DataSource<Paragraph | undefined> {
  /**
   * Number of paragraphs in the entire document
   */
  private _length = -1;
  /**
   * Array of data currently handled by the browser
   */
  private _cachedData = Array.from<Paragraph>({length: 3});
  /**
   * Index of the first paragraph in the cached data
   */
  private _cachedDataStartIndex;
  /**
   * The dataStream accessed by the angular change detection.
   * This streams wraps our cached data and provides new values to the collection viewer,
   * whenever the cache changes.
   */
  private _dataStream = new BehaviorSubject<(Paragraph | undefined)[]>(this._cachedData);
  /**
   * True, of there is a cache update currently in progress.
   */
  private _fetchUnderProgress = false;


  private _subscription = new Subscription();

  /**
   * ViewPort of the component this dataSource is located in.
   */
  private _cdkViewPort: CdkVirtualScrollViewport;
  public setViewPort(viewPort: CdkVirtualScrollViewport) {
    this._cdkViewPort = viewPort;
  }


  /**
   * Creates an instance of DocumentDataSource.
   * @param _documentService Document service
   * @param _messageService MessageBarService service
   * @param [_pageSize=100] Number of paragraphs to handled by the data source
   */
  constructor(
    private _documentService: DocumentService,
    private _messageService: MessageBarService = null,
    private _pageSize: number = 100) {
    super();
    this._cachedDataStartIndex = -1;
  }

  connect(collectionViewer: CollectionViewer): Observable<(Paragraph | undefined)[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe(range => {
      this.fetchPage(range.start, range.end - 1);
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
   * Fetches the new cache and visible content based on the current scroll position.
   * @private
   * @param {number} rangeStart Index of the first paragraph currently rendered (visible) in the view
   * @param {number} rangeEnd Index of the last paragraph currenlty rendered (vidible) in the view
   * @memberof DocumentDataSource
   */
  private async fetchPage(rangeStart: number, rangeEnd: number) {
    if (this._fetchUnderProgress) { return; }
    this._fetchUnderProgress = true;

    if (this._length === -1) {
      this._length = await this._documentService.getDocumentLength();
      this._cachedData = Array.from<Paragraph>({length: Math.min(this._length, this._pageSize)});
    }

    const quarter = this._pageSize / 4;
    let newStartIndex = this._cachedDataStartIndex;
    let refreshType = RefreshType.None;
    if (rangeStart < quarter) {
      refreshType = RefreshType.Up;
      newStartIndex = Math.max(this._cachedDataStartIndex - quarter, 0);
    } else if (rangeEnd > 3 * quarter) {
      refreshType = RefreshType.Down;
      newStartIndex = Math.max(this._cachedDataStartIndex + quarter, 0);
      if (this._cachedDataStartIndex + this._pageSize + quarter > this._length) {
        this._fetchUnderProgress = false;
        return;
      }
    }

    await this.updateView(newStartIndex, refreshType);
    this._fetchUnderProgress = false;
  }

  /**
   * Function to update the current document view based on scolling index changes.
   * @param startIndex The index of the first paragraph in the updated view
   * @param refreshType What side of the view should be updated (upper or lower)
   * @memberof DocumentDataSource
   */
  private async updateView(startIndex: number, refreshType: RefreshType) {
    if (this._cachedDataStartIndex !== startIndex) {
      this._cachedDataStartIndex = startIndex;
      this._cachedData = await this._documentService.getDocument(this._cachedDataStartIndex, this._cachedData.length);
      this._dataStream.next(this._cachedData);

      const quarter = this._pageSize / 4;
      const newRangeStart = this._cdkViewPort.getRenderedRange().start + 1;
      const scrollTo = refreshType === RefreshType.Up ? (newRangeStart + quarter) : (newRangeStart - quarter);
      this._cdkViewPort.scrollToIndex(scrollTo);

      this._messageService.showMessage(`New paragraphs have been loaded
      (range:${this._cachedDataStartIndex}-${this._cachedDataStartIndex + this._cachedData.length})`);
    }
  }

}
