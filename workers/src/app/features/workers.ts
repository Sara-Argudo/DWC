import { Component, computed, effect, signal } from '@angular/core';
import { CardWorker } from '../shared/components/card-worker';
import { worker } from '../core/models/worker';
import { WORKERS } from '../core/mocks/workers.mock';

@Component({
  imports: [CardWorker],
  selector: 'app-workers',
  styleUrl: './workers.css',
  templateUrl: './workers.html',
})
export class Workers {
  private readonly CLAVE_STORAGE = 'trabajadores';

  protected readonly workers = signal<worker[]>(this.cargarTrabajadores());

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
      workers.map((w) => (w.id === id ? { ...w, likes: 0 } : w))
    );
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

  protected eliminarTrabajador(id: number): void {
    this.workers.update((workers) => workers.filter((w) => w.id !== id));
  }

  protected cambiarDepartamento(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.departamentoSeleccionado.set(target.value);
  }

  private cargarTrabajadores(): worker[] {
    const datos = localStorage.getItem(this.CLAVE_STORAGE);

    if (datos === null) {
      return WORKERS;
    }

    try {
      const parsed = JSON.parse(datos) as worker[];
      if (!Array.isArray(parsed) || parsed.length < WORKERS.length) {
        return WORKERS;
      }
      return parsed;
    } catch {
      return WORKERS;
    }
  }

  private guardarTrabajadores(workers: worker[]): void {
    localStorage.setItem(this.CLAVE_STORAGE, JSON.stringify(workers));
  }

  protected readonly departamentoSeleccionado = signal('');

  protected readonly departamentos = computed(() => {
    const departamentos: string[] = [];

    for (const w of this.workers()) {
      if (!departamentos.includes(w.departamento)) {
        departamentos.push(w.departamento);
      }
    }

    if (
      this.departamentoSeleccionado() !== '' &&
      !departamentos.includes(this.departamentoSeleccionado())
    ) {
      this.departamentoSeleccionado.set('');
    }

    return departamentos;
  });

  protected readonly trabajadoresFiltrados = computed(() => {
    const departamento = this.departamentoSeleccionado();

    if (departamento === '') {
      return this.workers();
    }

    return this.workers().filter((w) => w.departamento === departamento);
  });

  protected readonly totalTrabajadores = computed(() => this.workers().length);

  protected readonly totalFiltrados = computed(() => this.trabajadoresFiltrados().length);
}
