import { AbstractControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed, Signal } from '@angular/core';

export interface CampoEstado {
  invalido: Signal<boolean>;
  valido: Signal<boolean>;
  mensaje: Signal<string | null>;
}

export function estadoCampo(
  control: AbstractControl,
  mensajes: Record<string, string>
): CampoEstado {
  const trigger = toSignal(control.events, { initialValue: null });

  const invalido = computed(() => {
    trigger();
    return control.invalid && control.touched;
  });

  const valido = computed(() => {
    trigger();
    return control.valid && control.touched;
  });

  const mensaje = computed(() => {
    trigger();
    if (!(control.invalid && control.touched)) return null;
    const errores = control.errors ?? {};
    const clave = Object.keys(mensajes).find(k => errores[k]);
    return clave ? mensajes[clave] : null;
  });

  return { invalido, valido, mensaje };
}