import { Component, signal } from '@angular/core';
import { PRODUCTS } from '../../core/mocks/products.mock';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {
  products = signal<Product[]>(PRODUCTS);

  showForm = signal(false);

  openForm(){
    this.showForm.set(true);
  }

  closeForm(){
    this.showForm.set(false);
  }

  title = signal('');
  price = signal(0);
  description = signal('');
  category = signal(Category.Electronics);
  image = signal('');

}
