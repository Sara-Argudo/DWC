import { Component } from '@angular/core';
import { Workers } from './features/workers/workers';

@Component({
  selector: 'app-root',
  imports: [Workers],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
