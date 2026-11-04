import { Component, signal } from '@angular/core';
import { Workers } from './features/workers';

@Component({
  imports: [Workers],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('WORKERS');
}
