import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,FormsModule,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  spinnerWithoutBackdrop = false;

  last:any
  info: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 10;
  hasChecker: string = 'all';
  filterTitle: string = '';
  sortOrder: "" | "asc" | "desc" | string = "";
  filterTimeout: any;

  isLoading:boolean=false
  
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllData();
  }

  showProgressSpinner = () => {
    this.displayProgressSpinner = true;
    setTimeout(() => {
      this.displayProgressSpinner = false;
    }, 3000);
  };
  showSpinnerWithoutBackdrop = () => {
    this.spinnerWithoutBackdrop = true;
    setTimeout(() => {
      this.spinnerWithoutBackdrop = false;
    }, 3000);
  };

  getAllData() {
    this.isLoading =true
    let queryParams = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('page_size', this.pageSize.toString())

    if (this.hasChecker !== 'all') {
      queryParams = queryParams.set('has_checker', this.hasChecker);
    }

    if (this.filterTitle) {
      queryParams = queryParams.set('title', this.filterTitle);
    }


    if (this.sortOrder) {
      queryParams = queryParams.set('ordering', this.sortOrder);
    }

    this.http.get<any>('https://kep.uz/api/problems', { params: queryParams }).subscribe((res) => {
      this.info = res.data;


        this.isLoading=false



      this.totalPages = Math.ceil(res.total / this.pageSize);
    });
  }

  onPageChange(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return; 
    }
    this.currentPage = pageNumber;
    this.getAllData();
  }

  onPageSizeChange() {
    this.currentPage = 1; 
    this.getAllData();
  }

  onHasCheckerChange() {
    this.currentPage = 1;
    this.getAllData();
  }

  applyFilters() {
  this.currentPage = 1;

  clearTimeout(this.filterTimeout);

  this.filterTimeout = setTimeout(() => {
    this.getAllData();
  }, 2000); 
  }


  sortBy(column: string) {
    this.sortOrder = this.sortOrder === column ? '-' + column : column;
    this.getAllData();
}

}
