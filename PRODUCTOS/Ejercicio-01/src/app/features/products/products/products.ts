import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRODUCTS } from '../../../core/mocks/products';
import { Product } from '../../../core/models/product';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  Product: Product = PRODUCTS[19];

cambiaProducto(){
 this.Product = PRODUCTS[7];
}
}
