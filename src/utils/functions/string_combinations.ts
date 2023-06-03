function permute(permutation: string[]): string[][] {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

export function stringCombinations(input_string: string): string[] {
    let words = input_string.split(' ');
    let permutations = permute(words);

    let combinations = permutations.map(p => p.join('')); // join without spaces
    combinations.push(...permutations.map(p => p.join(' '))); // join with spaces

    return combinations;
}