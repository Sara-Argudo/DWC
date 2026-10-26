import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Category } from '../../core/models/category.model';
import { PRODUCTS } from '../../core/mocks/products.mock';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products-signal',
  imports: [NgOptimizedImage],
  templateUrl: './products-signal.html',
  styleUrl: './products-signal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsSignal {
  // Signal de tipo array de Product, con los valores iniciales de PRODUCTS (copia del array).
  // En la plantilla se lee llamándolo como una función: products().
  protected readonly products = signal<Product[]>([...PRODUCTS]);

  // Producto que se da de alta al pulsar el botón (datos del producto 10 del array original).
  protected readonly newProduct: Product = {
    id: 10,
    title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
    price: 109,
    description:
      'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5" hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)',
    category: Category.Electronics,
    image: '/images/10.png',
    rating: { rate: 2.9, count: 470 }
  };

  // Producto que se da de alta dentro de un setTimeout (datos del producto 11 del array original).
  protected readonly delayedProduct: Product = {
    id: 11,
    title: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
    price: 109,
    description:
      '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.',
    category: Category.Electronics,
    image: '/images/11.png',
    rating: { rate: 4.8, count: 319 }
  };

  // Indican si ya se ha pulsado cada botón, para no añadir dos veces el mismo producto
  // (el @for usa track product.id y no puede haber dos productos con el mismo id).
  // Se cambian dentro del click, así que no necesitan ser signals.
  protected added = false;
  protected delayedRequested = false;

  // Con un signal no se hace push: update() recibe el array actual y devuelve uno NUEVO
  // con el producto añadido. Al cambiar el valor del signal, Angular se entera y repinta.
  // (Un push dentro de update() devolvería el mismo array y el signal no avisaría del cambio).
  protected addProduct(): void {
    if (this.added) {
      return;
    }
    this.products.update((products) => [...products, this.newProduct]);
    console.log('ProductsSignal - click: array products', this.products());
    this.added = true;
  }

  // El mismo alta, pero 2 segundos después, dentro de un setTimeout. A diferencia de
  // ProductsArray, aquí no hace falta ningún evento más: el cambio del signal avisa a Angular
  // y la tarjeta aparece sola, aunque la aplicación funcione sin zone.js (zoneless).
  protected addProductWithTimeout(): void {
    if (this.delayedRequested) {
      return;
    }
    this.delayedRequested = true;
    setTimeout(() => {
      this.products.update((products) => [...products, this.delayedProduct]);
      console.log('ProductsSignal - setTimeout: array products', this.products());
    }, 2000);
  }
}
