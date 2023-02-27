import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scg'
})
export class ScgHighlightingPipe implements PipeTransform {
    transform(value: string): string {
        const digitRegex = /(\d+) \|/g;
        const digitReplacement = '<span style="color: darkgrey">$1</span> |';
        const aquaRegex = /\|/g;
        const aquaReplacement = '<span style="color: aqua">$&</span>';
        const result = value.replace(digitRegex, digitReplacement).replace(aquaRegex, aquaReplacement);
        return result;
    }
}