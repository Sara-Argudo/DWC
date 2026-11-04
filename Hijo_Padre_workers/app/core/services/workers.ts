import { computed, effect, Injectable, signal } from '@angular/core';
import { Worker } from '../models/worker';
import { WORKERS } from '../mocks/workers.mock';


@Injectable({
  providedIn: 'root',
})
export class WorkersService {

  private workers = signal<Worker[]>(this.cargarWorkers());

  constructor() {
    // Cada vez que cambia la lista, se guarda en localStorage
    effect(() => {
      this.guardarWorkers(this.workers());
    });
  }

  totalWorkers = computed(() => this.workers().length);

  departamentos = computed(() => [...new Set(this.workers().map(w => w.departamento))]);

  readonly selectedDepartamento = signal<string>('Todos');

  setSelectedDepartamento(departamento: string): void {
    this.selectedDepartamento.set(departamento);
  }

  filteredWorkers = computed(() => {
    if (this.selectedDepartamento() === 'Todos') {
      return this.workers();
    }
    else {
      return this.workers().filter(w => w.departamento === this.selectedDepartamento());
    }
  })

  totalFilteredWorkers = computed(() => this.filteredWorkers().length);

  private cargarWorkers(): Worker[] {
    let workers = localStorage.getItem('workers')
    if (workers) {
      return JSON.parse(workers)
    }
    else
      return WORKERS
  }

  private guardarWorkers(workers: Worker[]): void {
    localStorage.setItem('workers', JSON.stringify(workers));
  }

  // -------------------- Gestionar likes --------------------

  like(id: number): void {
    this.cambiarLikes(id, 1);
  }

  unlike(id: number): void {
    this.cambiarLikes(id, -1);
  }

  private cambiarLikes(id: number, cambio: number): void {
    this.workers.update((workers) =>
      workers.map((w) => {
        if (w.id !== id) {
          return w;
        }
        if (w.likes === 0 && cambio < 0) {
          return w;
        }
        return { ...w, likes: w.likes + cambio };
      })
    );
  }

  quitarLikes(id: number): void {
    this.workers.update((workers) =>
      workers.map((w) => {
        if (w.id !== id) {
          return w;
        }
        return { ...w, likes: 0 };
      }
      ))
  }

  //--------------------- Gestionar eliminar trabajador --------------------

  eliminarWorker(id: number): void {
    this.workers.update((workers) => workers.filter((w) => w.id !== id));
  }

}
