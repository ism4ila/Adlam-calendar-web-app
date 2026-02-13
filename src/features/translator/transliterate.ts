export const LATIN_TO_ADLAM: Record<string, string> = {
    'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶',
    'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼',
    'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞥀',
    'A': '𞤀', 'B': '𞤄', 'C': '𞤇', 'D': '𞤁', 'E': '𞤅', 'F': '𞤆', 'G': '𞤊', 'H': '𞤋', 'I': '𞤌', 'J': '𞤏',
    'K': '𞤐', 'L': '𞤑', 'M': '𞤒', 'N': '𞤓', 'O': '𞤔', 'P': '𞤖', 'Q': '𞤗', 'R': '𞤘', 'S': '𞤙', 'T': '𞤚',
    'U': '𞤛', 'V': '𞤜', 'W': '𞤝', 'X': '𞤞', 'Y': '𞤟', 'Z': '𞤠',
    '0': '𞥐', '1': '𞥑', '2': '𞥒', '3': '𞥓', '4': '𞥔', '5': '𞥕', '6': '𞥖', '7': '𞥗', '8': '𞥘', '9': '𞥙',
};

export const ADLAM_TO_LATIN: Record<string, string> = Object.fromEntries(
    Object.entries(LATIN_TO_ADLAM).map(([k, v]) => [v, k])
);

export function transliterate(text: string, direction: 'latinToAdlam' | 'adlamToLatin'): string {
    const map = direction === 'latinToAdlam' ? LATIN_TO_ADLAM : ADLAM_TO_LATIN;
    let result = '';
    for (const char of text) {
        result += map[char] || char;
    }
    return result;
}
