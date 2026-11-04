import { Component, input, output } from '@angular/core';
import { worker } from '../../core/models/worker';

@Component({
  selector: 'app-card-worker',
  styleUrl: './card-worker.css',
  templateUrl: './card-worker.html',
})
export class CardWorker {
  readonly worker = input.required<worker>();

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
