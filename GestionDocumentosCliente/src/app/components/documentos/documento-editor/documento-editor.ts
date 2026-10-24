import { Component, computed, ElementRef, input, model, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-documento-editor',
  imports: [],
  templateUrl: './documento-editor.html',
  styleUrl: './documento-editor.css',
  host: { class: 'flex flex-col h-full' },
})
export class DocumentoEditor {
  contenido = model.required<string>();
  soloLectura = input(false);
  gutter = viewChild<ElementRef<HTMLDivElement>>('gutter');

  linea = signal(1);
  columna = signal(2);

  totalLineas = computed(() => this.contenido().split('\n').length);
  digitos = computed(() => String(this.totalLineas()).length);
  numeros = computed(() => Array.from({ length: this.totalLineas() }, (_, i) => i + 1).join('\n'));

  onInput(el: HTMLTextAreaElement): void {
    this.contenido.set(el.value);
    this.actualizarCursor(el);
  }

  actualizarCursor(el: HTMLTextAreaElement): void {
    const lineas = el.value.slice(0, el.selectionStart).split('\n');
    this.linea.set(lineas.length);
    this.columna.set(lineas[lineas.length - 1].length + 1);
  }

  sincronizarScroll(el: HTMLTextAreaElement): void {
    const g = this.gutter()?.nativeElement;
    if (g) g.scrollTop = el.scrollTop;
  }
}
