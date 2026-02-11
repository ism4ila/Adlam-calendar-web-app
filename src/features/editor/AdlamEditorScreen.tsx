import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Bold, Italic, AlignLeft, AlignCenter, AlignRight,
    Download, Image, Copy, Trash2, Type, Keyboard, Share2
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { useShare } from '../../hooks/useShare';

const LATIN_TO_ADLAM: Record<string, string> = {
    'a': '\u{1E922}', 'b': '\u{1E926}', 'c': '\u{1E937}', 'd': '\u{1E923}', 'e': '\u{1E92B}',
    'f': '\u{1E92C}', 'g': '\u{1E93A}', 'h': '\u{1E938}', 'i': '\u{1E92D}', 'j': '\u{1E936}',
    'k': '\u{1E933}', 'l': '\u{1E924}', 'm': '\u{1E925}', 'n': '\u{1E932}', 'o': '\u{1E92E}',
    'p': '\u{1E928}', 'q': '\u{1E939}', 'r': '\u{1E92A}', 's': '\u{1E927}', 't': '\u{1E93C}',
    'u': '\u{1E935}', 'v': '\u{1E93E}', 'w': '\u{1E931}', 'x': '\u{1E93F}', 'y': '\u{1E934}',
    'z': '\u{1E940}',
    'A': '\u{1E900}', 'B': '\u{1E904}', 'C': '\u{1E907}', 'D': '\u{1E901}', 'E': '\u{1E905}',
    'F': '\u{1E906}', 'G': '\u{1E90A}', 'H': '\u{1E90B}', 'I': '\u{1E90C}', 'J': '\u{1E90F}',
    'K': '\u{1E910}', 'L': '\u{1E911}', 'M': '\u{1E912}', 'N': '\u{1E913}', 'O': '\u{1E914}',
    'P': '\u{1E916}', 'Q': '\u{1E917}', 'R': '\u{1E918}', 'S': '\u{1E919}', 'T': '\u{1E91A}',
    'U': '\u{1E91B}', 'V': '\u{1E91C}', 'W': '\u{1E91D}', 'X': '\u{1E91E}', 'Y': '\u{1E91F}',
    'Z': '\u{1E920}',
    '0': '\u{1E950}', '1': '\u{1E951}', '2': '\u{1E952}', '3': '\u{1E953}', '4': '\u{1E954}',
    '5': '\u{1E955}', '6': '\u{1E956}', '7': '\u{1E957}', '8': '\u{1E958}', '9': '\u{1E959}',
};

const KEYBOARD_LAYOUT = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

function AdlamEditorScreen() {
    const { settings } = useSettingsStore();
    const [content, setContent] = useState('');
    const [fontSize, setFontSize] = useState(24);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [textAlign, setTextAlign] = useState<'right' | 'center' | 'left'>('right');
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [mode, setMode] = useState<'adlam' | 'latin'>('adlam');
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const { share } = useShare();

    const handleInput = useCallback((value: string) => {
        if (mode === 'adlam') {
            let converted = '';
            for (const char of value) {
                converted += LATIN_TO_ADLAM[char] || char;
            }
            setContent(converted);
        } else {
            setContent(value);
        }
    }, [mode]);

    const handleVirtualKey = (key: string) => {
        const adlamChar = LATIN_TO_ADLAM[key] || key;
        setContent(prev => prev + adlamChar);
        textareaRef.current?.focus();
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportImage = async () => {
        if (!printRef.current) return;
        try {
            const { default: html2canvas } = await import('html2canvas');
            const canvas = await html2canvas(printRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            });
            const link = document.createElement('a');
            link.download = `adlam-text-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch {
            // Fallback: copy text
            await handleCopy();
            alert(t(settings.language, 'editor.exportFallback'));
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>Adlam Text</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Adlam&display=swap');
                    body {
                        font-family: 'Noto Sans Adlam', sans-serif;
                        font-size: ${fontSize}px;
                        font-weight: ${isBold ? 'bold' : 'normal'};
                        font-style: ${isItalic ? 'italic' : 'normal'};
                        text-align: ${textAlign};
                        padding: 40px;
                        line-height: 1.8;
                        direction: rtl;
                    }
                </style>
            </head>
            <body>${content.replace(/\n/g, '<br>')}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                        {t(settings.language, 'editor.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'editor.desc')}
                    </p>
                </div>

                {/* Toolbar */}
                <Card className="p-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Mode toggle */}
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setMode('adlam')}
                                className={`px-3 py-2 text-sm font-semibold transition-colors ${mode === 'adlam' ? 'bg-violet-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                {t(settings.language, 'editor.modeAdlam')}
                            </button>
                            <button
                                onClick={() => setMode('latin')}
                                className={`px-3 py-2 text-sm font-semibold transition-colors ${mode === 'latin' ? 'bg-violet-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                            >
                                Latin
                            </button>
                        </div>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

                        {/* Font size */}
                        <div className="flex items-center gap-1">
                            <Type className="w-4 h-4 text-gray-500" />
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm"
                            >
                                {[16, 20, 24, 28, 32, 40, 48, 64].map(s => (
                                    <option key={s} value={s}>{s}px</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

                        {/* Style buttons */}
                        <button
                            onClick={() => setIsBold(!isBold)}
                            className={`p-2 rounded-lg transition-colors ${isBold ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsItalic(!isItalic)}
                            className={`p-2 rounded-lg transition-colors ${isItalic ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                            <Italic className="w-4 h-4" />
                        </button>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

                        {/* Alignment */}
                        <button onClick={() => setTextAlign('right')} className={`p-2 rounded-lg transition-colors ${textAlign === 'right' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            <AlignRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => setTextAlign('center')} className={`p-2 rounded-lg transition-colors ${textAlign === 'center' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button onClick={() => setTextAlign('left')} className={`p-2 rounded-lg transition-colors ${textAlign === 'left' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            <AlignLeft className="w-4 h-4" />
                        </button>

                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />

                        {/* Keyboard toggle */}
                        <button
                            onClick={() => setShowKeyboard(!showKeyboard)}
                            className={`p-2 rounded-lg transition-colors ${showKeyboard ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                            <Keyboard className="w-4 h-4" />
                        </button>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Actions */}
                        <Button variant="ghost" size="sm" onClick={() => setContent('')} disabled={!content}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!content}>
                            <Copy className="w-4 h-4 mr-1" />
                            {copied ? t(settings.language, 'editor.copied') : t(settings.language, 'editor.copy')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportImage} disabled={!content}>
                            <Image className="w-4 h-4 mr-1" /> PNG
                        </Button>
                        <Button variant="primary" size="sm" onClick={handlePrint} disabled={!content}>
                            <Download className="w-4 h-4 mr-1" /> PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => share({
                                title: t(settings.language, 'editor.title'),
                                text: content || t(settings.language, 'share.text'),
                                url: window.location.href,
                            })}
                            disabled={!content}
                            aria-label={t(settings.language, 'share.title')}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>

                {/* Editor Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <Card className="p-0 overflow-hidden">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-semibold text-gray-500">{t(settings.language, 'editor.input')}</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => handleInput(e.target.value)}
                            placeholder={t(settings.language, 'editor.placeholder')}
                            dir={mode === 'adlam' ? 'rtl' : 'ltr'}
                            className="w-full min-h-[300px] p-6 bg-transparent resize-none focus:outline-none font-adlam leading-relaxed text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-700"
                            style={{
                                fontSize: `${fontSize}px`,
                                fontWeight: isBold ? 'bold' : 'normal',
                                fontStyle: isItalic ? 'italic' : 'normal',
                                textAlign,
                            }}
                        />
                    </Card>

                    {/* Preview */}
                    <Card className="p-0 overflow-hidden">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-semibold text-gray-500">{t(settings.language, 'editor.preview')}</span>
                        </div>
                        <div
                            ref={printRef}
                            dir="rtl"
                            className="min-h-[300px] p-6 font-adlam leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words"
                            style={{
                                fontSize: `${fontSize}px`,
                                fontWeight: isBold ? 'bold' : 'normal',
                                fontStyle: isItalic ? 'italic' : 'normal',
                                textAlign,
                            }}
                        >
                            {content || <span className="text-gray-300 dark:text-gray-700">{t(settings.language, 'editor.previewEmpty')}</span>}
                        </div>
                    </Card>
                </div>

                {/* Virtual Keyboard */}
                {showKeyboard && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="p-4">
                            <div className="space-y-2">
                                {KEYBOARD_LAYOUT.map((row, i) => (
                                    <div key={i} className="flex justify-center gap-1 md:gap-2">
                                        {row.map(key => (
                                            <button
                                                key={key}
                                                onClick={() => handleVirtualKey(key)}
                                                className="w-8 h-10 md:w-11 md:h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-gray-900 dark:text-white font-bold flex flex-col items-center justify-center transition-colors border-b-2 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-0.5"
                                            >
                                                <span className="text-base md:text-lg font-adlam">{LATIN_TO_ADLAM[key]}</span>
                                                <span className="text-[9px] opacity-40 uppercase">{key}</span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => handleVirtualKey(' ')}
                                        className="flex-1 max-w-xs h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 text-sm font-semibold transition-colors border-b-2 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-0.5"
                                    >
                                        {t(settings.language, 'editor.space')}
                                    </button>
                                    <button
                                        onClick={() => handleVirtualKey('\n')}
                                        className="px-6 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 text-sm font-semibold transition-colors border-b-2 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-0.5"
                                    >
                                        Enter
                                    </button>
                                    <button
                                        onClick={() => setContent(prev => prev.slice(0, -1))}
                                        className="px-6 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 text-sm font-semibold transition-colors border-b-2 border-red-200 dark:border-red-900 active:border-b-0 active:translate-y-0.5"
                                    >
                                        {t(settings.language, 'editor.backspace')}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default AdlamEditorScreen;
