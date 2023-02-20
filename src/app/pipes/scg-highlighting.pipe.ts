import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scg'
})
export class ScgHighlightingPipe implements PipeTransform {
    transform(value: string): string {
        const parts = value.split(/(\|.*?\|)/g);

        // Loop through the parts of the string and wrap each part in a span with a different color
        const result = parts.reduce((acc, part, index) => {
            const color = index % 2 === 0 ? 'black' : 'green';
            return acc + (part.startsWith('|') && part.endsWith('|')
            ? `<span style="color: ${color}">${part}</span>`
            : part);
        }, '');

        return result;
    }
}