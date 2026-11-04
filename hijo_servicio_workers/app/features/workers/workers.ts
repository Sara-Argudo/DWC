import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorkersService } from '../../core/services/workers';
import { CardWorker } from '../../shared/components/card-worker/card-worker';

@Component({
  selector: 'app-workers',
  imports: [CardWorker],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Workers {

  // ----------------- injección de dependencias -----------------
  serviceWorkers = inject(WorkersService);

  // ----------------- propiedades del servicio -----------------

  filteredWorkers = this.serviceWorkers.filteredWorkers;
  totalWorkers = this.serviceWorkers.totalWorkers;
  totalFilteredWorkers = this.serviceWorkers.totalFilteredWorkers;
  departamentos = this.serviceWorkers.departamentos;
  selectedDepartamento = this.serviceWorkers.selectedDepartamento;

  // ----------------- métodos del componente que llaman al servicio -----------------
  setSelectedDepartmento(event: Event): void {
    const departamento = event.target as HTMLSelectElement;
    this.serviceWorkers.setSelectedDepartamento(departamento.value);
  }

  // solo se queda el método del filtro que sigue le padre porque el select esta en su plantilla
}




