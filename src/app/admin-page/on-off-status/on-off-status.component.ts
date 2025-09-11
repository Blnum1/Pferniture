import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-on-off-status',
  templateUrl: './on-off-status.component.html',
  styleUrls: ['./on-off-status.component.css']
})
export class OnOffStatusComponent implements AfterViewInit {
  displayedColumns: string[] = ['productID', 'category_Name', 'product_Name', 'price'];
  dataSource = new MatTableDataSource(PRODUCT_DATA);
  totalProducts = PRODUCT_DATA.length;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    // เชื่อมโยง paginator กับ dataSource
    this.dataSource.paginator = this.paginator;
  }

  // Handle Page Event (อาจไม่จำเป็น)
  handlePageEvent(event: any) {
    this.dataSource.paginator = event;
  }
}

const PRODUCT_DATA = [
  { productID: 1, category_Name: 'Category 1', product_Name: 'Product 1', price: 100 },
  { productID: 2, category_Name: 'Category 2', product_Name: 'Product 2', price: 200 },
  { productID: 3, category_Name: 'Category 3', product_Name: 'Product 3', price: 300 },
  { productID: 4, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 5, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 6, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 7, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 8, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 9, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 10, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 11, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 12, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 13, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 14, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 15, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 16, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 17, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
  { productID: 18, category_Name: 'Category 1', product_Name: 'Product 4', price: 400 },
];
