import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PRODUCTS } from '../../core/mocks/products.mock';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  imports: [NgOptimizedImage, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products {
  protected selectedArticulo: Product | undefined = undefined;
  protected searched = false;
  protected searchId: number | null = null;
  protected searchIdManual: number | null = null;

  protected search(id: string): void {
    this.findArticulo(Number(id));
  }

  protected searchById(): void {
    this.findArticulo(this.searchId);
  }

  protected updateSearchIdManual(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchIdManual = value === '' ? null : Number(value);
  }

  protected searchByIdManual(): void {
    this.findArticulo(this.searchIdManual);
  }

  private findArticulo(id: number | null): void {
    this.selectedArticulo = PRODUCTS.find((product) => product.id === id);
    this.searched = true;
  }
}
