import {DataSource} from "@angular/cdk/collections";
import {MatPaginator} from "@angular/material/paginator";
import {Observable, Subject, Subscription} from "rxjs";

export const DEFAULT_PAGE_SIZE = 10;

export abstract class JsonBackedDataSource<T> extends DataSource<T> {
  private data$: Subject<T[]> = new Subject<T[]>();
  private paging: MatPaginator;
  private subscription: Subscription[] = [];

  set paginator(paginator: MatPaginator) {
    this.paging = paginator;
    const sub = paginator.page
      .subscribe(pageEvent => {
        this.refresh(pageEvent.pageIndex, pageEvent.pageSize);
      });
    this.subscription.push(sub);
  }

  connect(): Observable<T[]> {
    return this.data$.asObservable();
  }

  disconnect(): void {
    this.data$.complete();
    this.subscription
      .filter(sub => !sub.closed)
      .forEach(sub => sub.unsubscribe());
  }

  refresh(page: number = 0, pageSize: number = DEFAULT_PAGE_SIZE): void {
    this.getAllData()
      .subscribe(all => {
        this.paging.length = all.length;
        this.paging.pageIndex = page;
        this.paging.pageSize = pageSize;

        const offset = page * pageSize;
        const data = all.slice(offset, offset+pageSize);
        this.data$.next(data);
      });
  }

  protected abstract getAllData(): Observable<T[]>;
}
