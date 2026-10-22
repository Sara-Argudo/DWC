import { Component, signal, computed } from '@angular/core';
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

  categories = Object.values(Category);

  mode = signal<'new' | 'edit'>('new');
  selectedProduct = signal<Product | undefined>(undefined);

  showForm = signal(false);

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
    const product: Product = {
    id: id,
    title: this.title(),
    price: this.price() || 0,
    description: this.description(),
    category: this.category(),
    image: this.image(),
    rating: { rate: 0, count: 0 }
    };
    
    this.products.update(products => [...products, product]);
    this.closeForm();
}

  editProduct(product: Product) {
    this.mode.set('edit');
    this.selectedProduct.set(product);
    this.title.set(product.title);
    this.price.set(product.price);
    this.description.set(product.description);
    this.category.set(product.category);
    this.image.set(product.image);
    this.showForm.set(true);
  }

  updateProduct() {
    const selected = this.selectedProduct();
    if (!selected) {
    return;
    }
    
    const updatedProduct: Product = {
    ...selected,
    title: this.title(),
    price: this.price() || 0,
    description: this.description(),
    category: this.category(),
    image: this.image()
    };
    
    this.products.update(products =>
    products.map(product => (product.id === updatedProduct.id ? updatedProduct : product))
    );
    this.closeForm();
  }

  save() {
    if (this.mode() === 'new') {
    this.addProduct();
  } else {
    this.updateProduct();
  }
  }

  deleteProduct(id: number) {
    const selected = this.selectedProduct();
    if (selected && selected.id === id) {
      this.closeForm();
    }

    this.products.update(products => products.filter(product => product.id !== id));
  }

  clearFields() {
    this.title.set('');
    this.price.set(0);
    this.description.set('');
    this.category.set(Category.Electronics);
    this.image.set('');
  }

  newProduct() {
    this.clearFields();
    this.mode.set('new');
    this.selectedProduct.set(undefined);
    this.showForm.set(true);
  }

  closeForm() {
    this.clearFields();
    this.mode.set('new');
    this.selectedProduct.set(undefined);
    this.showForm.set(false);
  }

  totalProducts = computed(() => this.products().length);
}
