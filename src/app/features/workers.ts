import { Component, signal, effect, computed } from '@angular/core';
import { CardWorker } from '../shared/components/card-worker';
import { worker } from '../core/models/worker';
import { WORKERS } from '../core/mocks/workers.mock';

const CLAVE_STORAGE = 'trabajadores';

@Component({
  imports: [CardWorker],
  selector: 'app-workers',
  styleUrl: './workers.css',
  templateUrl: './workers.html',
})
export class Workers {

  protected readonly workers =
    signal<worker[]>(this.cargarTrabajadores());

  protected readonly departamentoSeleccionado = signal('');

  protected readonly departamentos = computed(() => {
    const departamentos: string[] = [];

    for (const t of this.workers()) {
      if (!departamentos.includes(t.departamento)) {
        departamentos.push(t.departamento);
      }
    }

    return departamentos;
  });

  protected readonly totalTrabajadores = computed(() =>
    this.workers().length
  );

  protected readonly totalFiltrados = computed(() =>
    this.trabajadoresFiltrados().length
  );

  protected readonly trabajadoresFiltrados = computed(() => {
    const departamento = this.departamentoSeleccionado();

    if (departamento === '') {
      return this.workers();
    }

    return this.workers().filter(
      (w) => w.departamento === departamento
    );
  });

  constructor() {
    effect(() => this.guardarTrabajadores(this.workers()));
  }

  protected sumarLike(id: number): void {
    this.cambiarLikes(id, 1);
  }

  protected restarLike(id: number): void {
    this.cambiarLikes(id, -1);
  }

  protected quitarLikes(id: number): void {
    this.workers.update((workers) =>
      workers.map((w) => {
        if (w.id === id) {
          return { ...w, likes: 0 };
        }

        return w;
      })
    );
  }

  protected eliminarTrabajador(id: number): void {
    this.workers.update((workers) =>
      workers.filter((w) => w.id !== id)
    );
  }

  protected cambiarDepartamento(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    this.departamentoSeleccionado.set(select.value);
  }

  private cambiarLikes(id: number, cambio: number): void {
    this.workers.update((workers) =>
      workers.map((w) => {
        if (w.id !== id) {
          return w;
        }

        if (cambio === -1 && w.likes === 0) {
          return w;
        }

        return { ...w, likes: w.likes + cambio };
      })
    );
  }

  private cargarTrabajadores(): worker[] {
    const datos = localStorage.getItem(CLAVE_STORAGE);

    if (datos === null) {
      return WORKERS;
    }

    return JSON.parse(datos);
  }

  private guardarTrabajadores(workers: worker[]): void {
    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify(workers)
    );
  }
}
