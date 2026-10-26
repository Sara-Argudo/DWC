import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ProductsArray } from './features/products-array/products-array';
import { ProductsSignal } from './features/products-signal/products-signal';
import { Products } from './features/products/products';
import { Reactividad } from './features/reactividad/reactividad';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Products, ProductsArray, ProductsSignal, Reactividad],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
