import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Download, FilePlus, Copy } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const LATIN_TO_ADLAM: Record<string, string> = {
    'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶',
    'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼',
    'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞥀',
    'A': '𞤀', 'B': '𞤄', 'C': '𞤇', 'D': '𞤁', 'E': '𞤅', 'F': '𞤆', 'G': '𞤊', 'H': '𞤋', 'I': '𞤌', 'J': '𞤏',
    'K': '𞤐', 'L': '𞤑', 'M': '𞤒', 'N': '𞤓', 'O': '𞤔', 'P': '𞤖', 'Q': '𞤗', 'R': '𞤘', 'S': '𞤙', 'T': '𞤚',
    'U': '𞤛', 'V': '𞤜', 'W': '𞤝', 'X': '𞤞', 'Y': '𞤟', 'Z': '𞤠',
};

function WordScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const editorRef = useRef<HTMLDivElement>(null);
    const [adlamMode, setAdlamMode] = useState(true);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        if (!adlamMode || !editorRef.current) return;
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const textNode = range.startContainer;
        if (textNode.nodeType !== Node.TEXT_NODE) return;

        const text = textNode.textContent || '';
        const offset = range.startOffset;
        if (offset === 0) return;

        const lastChar = text[offset - 1];
        const adlam = LATIN_TO_ADLAM[lastChar];
        if (adlam) {
            const before = text.slice(0, offset - 1);
            const after = text.slice(offset);
            textNode.textContent = before + adlam + after;
            const newRange = document.createRange();
            newRange.setStart(textNode, before.length + adlam.length);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
        }
    };

    const handleExport = () => {
        if (!editorRef.current) return;
        const content = editorRef.current.innerHTML;
        const blob = new Blob([
            `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:'Noto Sans Adlam',sans-serif;font-size:18px;padding:40px;line-height:1.8;}</style></head><body>${content}</body></html>`
        ], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adlam-document.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (!editorRef.current) return;
        navigator.clipboard.writeText(editorRef.current.innerText);
    };

    const handleNewDoc = () => {
        if (!editorRef.current) return;
        editorRef.current.innerHTML = '';
        editorRef.current.focus();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'word.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'word.desc')}</p>
                </div>

                {/* Toolbar */}
                <Card className="!p-3">
                    <div className="flex flex-wrap items-center gap-1">
                        <button onClick={() => setAdlamMode(!adlamMode)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${adlamMode ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        >
                            𞤀 Adlam
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button onClick={() => execCommand('bold')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.bold')} aria-label={t(language, 'word.bold')}>
                            <Bold className="w-4 h-4" />
                        </button>
                        <button onClick={() => execCommand('italic')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.italic')} aria-label={t(language, 'word.italic')}>
                            <Italic className="w-4 h-4" />
                        </button>
                        <button onClick={() => execCommand('underline')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.underline')} aria-label={t(language, 'word.underline')}>
                            <Underline className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button onClick={() => execCommand('justifyLeft')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.alignLeft')} aria-label={t(language, 'word.alignLeft')}>
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => execCommand('justifyCenter')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.alignCenter')} aria-label={t(language, 'word.alignCenter')}>
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button onClick={() => execCommand('justifyRight')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title={t(language, 'word.alignRight')} aria-label={t(language, 'word.alignRight')}>
                            <AlignRight className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <select
                            onChange={(e) => execCommand('fontSize', e.target.value)}
                            className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm"
                            defaultValue="4"
                        >
                            <option value="2">{t(language, 'word.sizeSmall')}</option>
                            <option value="4">{t(language, 'word.sizeNormal')}</option>
                            <option value="5">{t(language, 'word.sizeLarge')}</option>
                            <option value="6">{t(language, 'word.sizeXLarge')}</option>
                        </select>
                        <div className="flex-1" />
                        <Button variant="ghost" size="sm" onClick={handleNewDoc}>
                            <FilePlus className="w-4 h-4 mr-1" /> {t(language, 'word.newDoc')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            <Copy className="w-4 h-4 mr-1" /> {t(language, 'editor.copy')}
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleExport}>
                            <Download className="w-4 h-4 mr-1" /> {t(language, 'word.export')}
                        </Button>
                    </div>
                </Card>

                {/* Editor Area */}
                <Card className="!p-0">
                    <div
                        ref={editorRef}
                        contentEditable
                        role="textbox"
                        aria-multiline="true"
                        aria-label={t(language, 'word.title')}
                        tabIndex={0}
                        dir="rtl"
                        onInput={handleInput}
                        className="min-h-[500px] p-8 outline-none font-adlam text-lg leading-relaxed text-gray-900 dark:text-white"
                        style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                        data-placeholder={t(language, 'word.placeholder')}
                    />
                </Card>
            </motion.div>
        </div>
    );
}

export default WordScreen;
