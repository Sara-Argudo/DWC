import { Component, computed, effect, signal } from '@angular/core';

import { PRODUCTS } from '../../core/mocks/products.mock';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

// Clave con la que se guardan los productos en localStorage.
const STORAGE_KEY = 'products';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  // Signal de tipo array con todos los productos. Su valor inicial son los
  // productos guardados en localStorage o, si no hay, los del mock.
  products = signal<Product[]>(this.loadProducts());

  // Signal calculado (de solo lectura): número total de productos.
  // Se vuelve a calcular automáticamente cada vez que cambia products.
  totalProducts = computed(() => this.products().length);

  // Texto escrito en el filtro.
  searchText = signal('');

  // Categoría elegida en el filtro: una del enum Category o 'all' (Todas).
  searchCategory = signal<Category | 'all'>('all');

  // Signal calculado: productos que cumplen los dos filtros a la vez.
  // - Título: contiene el texto del filtro, sin distinguir mayúsculas y
  //   minúsculas. Con el filtro vacío, includes('') devuelve true.
  // - Categoría: es la elegida, o se ha elegido 'all' (Todas).
  // Se vuelve a calcular cuando cambia products, searchText o searchCategory.
  filteredProducts = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const category = this.searchCategory();
    return this.products().filter(
      product =>
        product.title.toLowerCase().includes(text) &&
        (category === 'all' || product.category === category)
    );
  });

  // Signal calculado: número de productos que cumplen el filtro.
  totalFilteredProducts = computed(() => this.filteredProducts().length);

  // Indica si se muestra el div de alta de producto.
  showForm = signal(false);

  // Modo del div: crear un producto nuevo o editar uno existente.
  mode = signal<'new' | 'edit'>('new');

  // Producto que se está editando (undefined si se está creando uno nuevo).
  selectedProduct = signal<Product | undefined>(undefined);

  // Valores del enum Category, para las opciones del <select>.
  categories = Object.values(Category);

  // Un signal por cada campo del producto.
  title = signal('');
  price = signal(0);
  description = signal('');
  category = signal(Category.Electronics);
  image = signal('');

  constructor() {
    // Effect: cada vez que cambia products, guarda la lista en localStorage.
    // Solo se dispara con products, que es el único signal que lee.
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products()));
    });
  }

  // Lee los productos guardados en localStorage. Si no hay ninguno guardado
  // (la primera vez que se abre la aplicación), devuelve los del mock.
  loadProducts(): Product[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return PRODUCTS;
    }
    return JSON.parse(saved) as Product[];
  }

  // Guarda en searchText lo que se escribe en el filtro.
  setSearchText(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  // Guarda en searchCategory la categoría elegida en el filtro.
  setSearchCategory(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.searchCategory.set(select.value as Category | 'all');
  }

  // Métodos que guardan en cada signal lo que escribe el usuario.
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

  // Vacía los signals de los campos.
  clearFields() {
    this.title.set('');
    this.price.set(0);
    this.description.set('');
    this.category.set(Category.Electronics);
    this.image.set('');
  }

  // Muestra el div para crear un producto nuevo, con los campos vacíos.
  newProduct() {
    this.clearFields();
    this.mode.set('new');
    this.selectedProduct.set(undefined);
    this.showForm.set(true);
  }

  // Muestra el div para editar el producto seleccionado, con sus datos cargados.
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

  // Vacía los campos, vuelve al modo nuevo y oculta el div.
  closeForm() {
    this.clearFields();
    this.mode.set('new');
    this.selectedProduct.set(undefined);
    this.showForm.set(false);
  }

  // Guardar: según el modo, crea un producto nuevo o actualiza el seleccionado.
  save() {
    if (this.mode() === 'new') {
      this.addProduct();
    } else {
      this.updateProduct();
    }
  }

  // Crea el producto nuevo y lo añade a la lista.
  addProduct() {
    // El id es el del último producto + 1 (o 1 si la lista está vacía).
    const lastProduct = this.products().at(-1);
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const product: Product = {
      id: id,
      title: this.title(),
      // Si el campo del precio está vacío, su valor es NaN: se guarda 0.
      price: this.price() || 0,
      description: this.description(),
      category: this.category(),
      image: this.image(),
      rating: { rate: 0, count: 0 }
    };

    // Inmutabilidad: no se modifica el array actual, se crea uno nuevo.
    this.products.update(products => [...products, product]);

    this.closeForm();
  }

  // Actualiza el producto seleccionado con los datos de los campos.
  updateProduct() {
    const selected = this.selectedProduct();
    if (!selected) {
      return;
    }

    // Inmutabilidad: se crea un objeto nuevo copiando el producto seleccionado
    // (conserva id y rating) y sustituyendo los datos que se pueden editar.
    const updatedProduct: Product = {
      ...selected,
      title: this.title(),
      price: this.price() || 0,
      description: this.description(),
      category: this.category(),
      image: this.image()
    };

    // Inmutabilidad: map crea un array nuevo con el producto actualizado en su sitio.
    this.products.update(products =>
      products.map(product => (product.id === updatedProduct.id ? updatedProduct : product))
    );

    this.closeForm();
  }

  // Borra el producto con el id indicado.
  deleteProduct(id: number) {
    // Si se está editando el producto que se borra, se cierra el div.
    const selected = this.selectedProduct();
    if (selected && selected.id === id) {
      this.closeForm();
    }

    // Inmutabilidad: filter crea un array nuevo sin el producto borrado.
    this.products.update(products => products.filter(product => product.id !== id));
  }
}
