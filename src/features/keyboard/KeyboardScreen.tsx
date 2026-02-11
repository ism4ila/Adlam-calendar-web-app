import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Copy, Delete, Space } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const LATIN_TO_ADLAM: Record<string, string> = {
    'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶',
    'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼',
    'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞥀',
    'A': '𞤀', 'B': '𞤄', 'C': '𞤇', 'D': '𞤁', 'E': '𞤅', 'F': '𞤆', 'G': '𞤊', 'H': '𞤋', 'I': '𞤌', 'J': '𞤏',
    'K': '𞤐', 'L': '𞤑', 'M': '𞤒', 'N': '𞤓', 'O': '𞤔', 'P': '𞤖', 'Q': '𞤗', 'R': '𞤘', 'S': '𞤙', 'T': '𞤚',
    'U': '𞤛', 'V': '𞤜', 'W': '𞤝', 'X': '𞤞', 'Y': '𞤟', 'Z': '𞤠',
    '0': '𞥐', '1': '𞥑', '2': '𞥒', '3': '𞥓', '4': '𞥔', '5': '𞥕', '6': '𞥖', '7': '𞥗', '8': '𞥘', '9': '𞥙',
};

const KEYBOARD_LAYOUT = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

function KeyboardScreen() {
    const { settings } = useSettingsStore();
    const [text, setText] = useState('');

    const handleKeyClick = (key: string) => {
        setText(prev => prev + (LATIN_TO_ADLAM[key] || key));
    };

    const handleBackspace = () => {
        setText(prev => prev.slice(0, -1));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };

    const handleInputChange = (val: string) => {
        // Simple real-time conversion
        let converted = '';
        for (const char of val) {
            converted += LATIN_TO_ADLAM[char] || char;
        }
        setText(converted);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
                        ⌨️ {t(settings.language, 'keyboard.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'keyboard.desc')}
                    </p>
                </div>

                <Card className="p-0 overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-2xl">
                    {/* Display Area */}
                    <div className="p-8 bg-gray-50 dark:bg-gray-900/50 min-h-[200px] flex flex-col justify-between">
                        <div 
                            className="text-5xl md:text-6xl font-adlam break-words text-right leading-relaxed"
                            dir="rtl"
                        >
                            {text || <span className="text-gray-300 dark:text-gray-700">{t(settings.language, 'keyboard.placeholder')}</span>}
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <Button variant="outline" onClick={() => setText('')} disabled={!text}>
                                {t(settings.language, 'keyboard.clear')}
                            </Button>
                            <Button variant="primary" onClick={handleCopy} disabled={!text}>
                                <Copy className="w-4 h-4 mr-2" /> {t(settings.language, 'keyboard.copy')}
                            </Button>
                        </div>
                    </div>

                    {/* Keyboard Area */}
                    <div className="p-4 md:p-8 bg-white dark:bg-gray-800 space-y-2 md:space-y-4">
                        {KEYBOARD_LAYOUT.map((row, i) => (
                            <div key={i} className="flex justify-center gap-1 md:gap-2">
                                {row.map(key => (
                                    <button
                                        key={key}
                                        onClick={() => handleKeyClick(key)}
                                        className="w-8 h-10 md:w-12 md:h-14 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-gray-900 dark:text-white font-bold flex flex-col items-center justify-center transition-colors border-b-4 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-1"
                                    >
                                        <span className="text-lg md:text-xl font-adlam">{LATIN_TO_ADLAM[key]}</span>
                                        <span className="text-[10px] opacity-40 uppercase">{key}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleKeyClick(' ')}
                                className="flex-1 max-w-sm h-12 md:h-14 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white flex items-center justify-center transition-colors border-b-4 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-1"
                            >
                                <Space className="w-6 h-6 opacity-40" />
                            </button>
                            <button
                                onClick={handleBackspace}
                                className="w-16 md:w-24 h-12 md:h-14 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 flex items-center justify-center transition-colors border-b-4 border-red-200 dark:border-red-900 active:border-b-0 active:translate-y-1"
                            >
                                <Delete className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Direct Typing */}
                <Card>
                    <h3 className="font-bold mb-4">{t(settings.language, 'keyboard.direct')}</h3>
                    <Input 
                        placeholder={t(settings.language, 'keyboard.directPlaceholder')}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                        {t(settings.language, 'keyboard.directDesc')}
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

export default KeyboardScreen;