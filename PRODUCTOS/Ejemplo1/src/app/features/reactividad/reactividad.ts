import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-reactividad',
  templateUrl: './reactividad.html',
  styleUrl: './reactividad.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reactividad {
  // Sin signal: propiedad numérica normal.
  protected dato1 = 1;

  // Con signal: signal numérico. Se lee llamándolo como una función: dato2().
  protected readonly dato2 = signal(1);

  // Desde un (click): el evento de la plantilla avisa a Angular y la vista se repinta.
  protected incrementDato1(): void {
    this.dato1++;
    console.log('Sin signal - click: dato1 =', this.dato1);
  }

  // Dentro de un setTimeout: sin zone.js nadie avisa a Angular de este cambio.
  // El valor cambia (se ve en la consola), pero la vista no se repinta hasta el
  // siguiente evento de plantilla, por ejemplo el botón «Revisar componente».
  protected incrementDato1WithTimeout(): void {
    setTimeout(() => {
      this.dato1++;
      console.log('Sin signal - setTimeout: dato1 =', this.dato1);
    }, 2000);
  }

  // update() recibe el valor actual y devuelve el nuevo. Al cambiar el valor del
  // signal, Angular se entera y repinta la vista.
  protected incrementDato2(): void {
    this.dato2.update((value) => value + 1);
    console.log('Con signal - click: dato2 =', this.dato2());
  }

  // Dentro de un setTimeout: el signal avisa a Angular él mismo, así que la vista
  // se repinta sola a los 2 segundos, aunque la aplicación funcione sin zone.js.
  protected incrementDato2WithTimeout(): void {
    setTimeout(() => {
      this.dato2.update((value) => value + 1);
      console.log('Con signal - setTimeout: dato2 =', this.dato2());
    }, 2000);
  }

  // No cambia nada: solo sirve para provocar un evento de plantilla (click),
  // que obliga a Angular a revisar todo el componente y pintar lo que haya cambiado.
  protected checkView(): void {}
}
