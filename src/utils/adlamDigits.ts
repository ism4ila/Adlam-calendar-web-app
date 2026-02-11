export function toAdlamDigits(text: string): string {
  const adlamDigits = ['𞥐', '𞥑', '𞥒', '𞥓', '𞥔', '𞥕', '𞥖', '𞥗', '𞥘', '𞥙'];
  return text.replace(/\d/g, (digit) => adlamDigits[parseInt(digit)]);
}

export function fromAdlamDigits(text: string): string {
  const adlamToArabic: Record<string, string> = {
    '𞥐': '0', '𞥑': '1', '𞥒': '2', '𞥓': '3', '𞥔': '4',
    '𞥕': '5', '𞥖': '6', '𞥗': '7', '𞥘': '8', '𞥙': '9'
  };
  // Use Unicode escape sequences for the range and the 'u' flag
  return text.replace(/[\u{1E950}-\u{1E959}]/gu, (char) => adlamToArabic[char] || char);
}