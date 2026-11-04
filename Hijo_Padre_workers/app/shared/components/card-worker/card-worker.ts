import { Component, inject, input, output } from '@angular/core';
import { Worker } from '../../../core/models/worker';
import { WorkersService } from '../../../core/services/workers';

@Component({
  selector: 'app-card-worker',
  templateUrl: './card-worker.html',
  styleUrl: './card-worker.css'
})
export class CardWorker {
  

  readonly worker = input.required<Worker>();

  readonly like = output<number>();
  readonly unlike = output<number>();
  readonly quitarLikes = output<number>();
  readonly eliminar = output<number>();

  protected darLike(): void {
    this.like.emit(this.worker().id);
  }

  protected darUnlike(): void {
    this.unlike.emit(this.worker().id);
  }

  protected quitarTodosLosLikes(): void {
    this.quitarLikes.emit(this.worker().id);
  }

  protected eliminarTrabajador(): void {
    this.eliminar.emit(this.worker().id);
  }

}
