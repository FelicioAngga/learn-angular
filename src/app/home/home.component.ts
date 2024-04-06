import { Component, ViewChild, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private productsService: ProductsService
  ) {  }

  @ViewChild('paginator') paginator: Paginator | undefined;
  
  products: Product[] = [];
  totalItems: number = 0;
  displayAddPopUp: boolean = false;
  displayEditPopUp: boolean = false;

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0
  }

  toggleEditPopUp(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopUp = !this.displayEditPopUp;
  }

  toggleDeletePopUp(product: Product) {
    if (!product.id) return;
    this.deleteProduct(product.id);
  }

  toggleAddPopUp = () => this.displayAddPopUp = !this.displayAddPopUp;

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) return;
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopUp = false;
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopUp = false;
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService.getProducts('http://localhost:3000/clothes', {
      page,
      perPage,
    }).subscribe({
      next: (products: Products ) => {
        this.products = products.items;
        this.totalItems = products.total;
      },
      error: (error) => console.log(error),
    })
  }

  addProduct(product: Product) {
    this.productsService.addProduct(`http://localhost:3000/clothes/`, product)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.fetchProducts(0, 5);
        this.resetPaginator()
      },
      error: (error) => console.log(error),
    });
  }

  editProduct(product: Product, id: number) {
    this.productsService.editProduct(`http://localhost:3000/clothes/${id}`, product)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.fetchProducts(0, 5);
        this.resetPaginator()
      },
      error: (error) => console.log(error),
    });
  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(`http://localhost:3000/clothes/${id}`)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.fetchProducts(0, 5);
        this.resetPaginator()
      },
      error: (error) => console.log(error),
    });
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  ngOnInit() {
    this.fetchProducts(0, 5);
  }
}
