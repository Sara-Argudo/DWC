import { Component, inject, input, output } from '@angular/core';
import { Worker } from '../../../core/models/worker';
import { WorkersService } from '../../../core/services/workers';

@Component({
  selector: 'app-card-worker',
  templateUrl: './card-worker.html',
  styleUrl: './card-worker.css'
})
export class CardWorker {
  
  servicioWorkers = inject(WorkersService); /*--> inyecta el servicio*/

  readonly worker = input.required<Worker>();



 /*eliminamos los outputs*/
 protected darLike(): void {
  this.servicioWorkers.like(this.worker().id);
 }
 protected darUnlike(): void {
  this.servicioWorkers.unlike(this.worker().id);
 }
 protected quitarTodosLosLikes(): void {
  this.servicioWorkers.quitarLikes(this.worker().id);
 }
 protected eliminarTrabajador(): void {
  this.servicioWorkers.eliminarWorker(this.worker().id);
 }


  

}
