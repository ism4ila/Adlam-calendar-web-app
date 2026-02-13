import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeftRight, Copy, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { LATIN_TO_ADLAM, transliterate } from './transliterate';

function TranslatorScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [direction, setDirection] = useState<'latinToAdlam' | 'adlamToLatin'>('latinToAdlam');
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const translate = useCallback((text: string): string => {
        return transliterate(text, direction);
    }, [direction]);

    const output = translate(input);

    const handleSwap = () => {
        const newDir = direction === 'latinToAdlam' ? 'adlamToLatin' : 'latinToAdlam';
        setDirection(newDir);
        setInput(output);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isAdlamInput = direction === 'adlamToLatin';

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'translator.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'translator.desc')}</p>
                </div>

                {/* Direction indicator */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-lg font-bold ${!isAdlamInput ? 'text-amber-600' : 'text-gray-400'}`}>
                        {t(language, 'translator.latin')}
                    </span>
                    <button
                        onClick={handleSwap}
                        aria-label="Swap direction"
                        className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                    >
                        <ArrowLeftRight className="w-5 h-5 text-amber-600" />
                    </button>
                    <span className={`text-lg font-bold ${isAdlamInput ? 'text-amber-600' : 'text-gray-400'}`}>
                        {t(language, 'translator.adlam')}
                    </span>
                </div>

                {/* Input */}
                <Card>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-500">
                            {isAdlamInput ? t(language, 'translator.adlam') : t(language, 'translator.latin')}
                        </span>
                        <button
                            onClick={() => setInput('')}
                            aria-label="Clear"
                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" /> {t(language, 'translator.clear')}
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        dir={isAdlamInput ? 'rtl' : 'ltr'}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none h-32 text-lg"
                        style={isAdlamInput ? { fontFamily: "'Noto Sans Adlam', sans-serif" } : undefined}
                        placeholder="..."
                    />
                </Card>

                {/* Output */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-amber-600">
                            {isAdlamInput ? t(language, 'translator.latin') : t(language, 'translator.adlam')}
                        </span>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            <Copy className="w-3 h-3 mr-1" />
                            {copied ? t(language, 'translator.copied') : t(language, 'translator.copy')}
                        </Button>
                    </div>
                    <div
                        dir={!isAdlamInput ? 'rtl' : 'ltr'}
                        className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white min-h-[128px] text-lg break-words whitespace-pre-wrap"
                        style={!isAdlamInput ? { fontFamily: "'Noto Sans Adlam', sans-serif" } : undefined}
                    >
                        {output || '...'}
                    </div>
                </Card>

                {/* Quick reference */}
                <Card>
                    <h3 className="text-sm font-bold text-gray-500 mb-3">{t(language, 'translator.quickRef')}</h3>
                    <div className="grid grid-cols-13 gap-1 text-center text-xs">
                        {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
                            <div key={letter} className="space-y-0.5">
                                <div className="text-gray-400">{letter}</div>
                                <div className="text-amber-600 text-sm" style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}>
                                    {LATIN_TO_ADLAM[letter]}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default TranslatorScreen;
