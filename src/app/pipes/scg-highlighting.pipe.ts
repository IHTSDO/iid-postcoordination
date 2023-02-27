import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scg'
})
export class ScgHighlightingPipe implements PipeTransform {
    transform(value: string): string {
        const digitRegex = /(\d+) \|/g;
        const digitReplacement = '<span style="color: grey">$1</span> |';
        const aquaRegex = /\|/g;
        const aquaReplacement = '<span style="color: aqua">$&</span>';
        // replacement for the chacaters '=', ':' to set dark red color, avoiding characters inside html tags
        const redRegex = /(?<!\w)(=|:)(?!\w)/g;
        const redReplacement = '<span style="color: darkred">$&</span>';
        const result = value.replace(digitRegex, digitReplacement).replace(aquaRegex, aquaReplacement).replace(redRegex, redReplacement);
        return result;
    }
}