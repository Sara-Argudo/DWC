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

  setTitle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.title.set(input.value);
  }
  setPrice(event: Event) {
    const input = event.target as HTMLInputElement;
    this.price.set(input.valueAsNumber);
  }
  setDescription(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.description.set(textarea.value);
  }
  setCategory(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.category.set(select.value as Category);
  }
  setImage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.image.set(input.value);
  }

  addProduct() {
    const lastProduct = this.products().at(-1);
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct: Product = {
    id: id,
    title: this.title(),
    price: this.price() || 0,
    description: this.description(),
    category: this.category(),
    image: this.image(),
    rating: { rate: 0, count: 0 }
    };

    this.products.update(products => [...products, newProduct]);
    this.closeForm();
  }

}
