import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const SAMPLE_TEXTS = [
    '𞤀𞤁𞤂𞤃𞤄𞤅𞤆𞤇𞤈𞤉𞤊𞤋𞤌𞤍𞤎𞤏𞤐𞤑𞤒𞤓𞤔𞤕𞤖𞤗𞤘𞤙𞤚𞤛',
    '𞤢𞤣𞤤𞤥𞤦𞤧𞤨𞤩𞤪𞤫𞤬𞤭𞤮𞤯𞤰𞤱𞤲𞤳𞤴𞤵𞤶𞤷𞤸𞤹𞤺𞤻𞤼𞤽',
    '𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙',
    '𞤔𞤢𞤢𞤪𞤢𞤥𞤢 — 𞤖𞤢𞤤𞤢 — 𞤀𞤣𞤤𞤢𞤥',
];

const FONT_STYLES = [
    { name: 'Noto Sans Adlam', family: "'Noto Sans Adlam', sans-serif", description: 'Google Noto — Default' },
    { name: 'Noto Sans Adlam Bold', family: "'Noto Sans Adlam', sans-serif", weight: '700', description: 'Google Noto — Bold' },
    { name: 'System Fallback', family: 'sans-serif', description: 'System default rendering' },
    { name: 'Serif Style', family: 'serif', description: 'Serif rendering' },
    { name: 'Monospace', family: "'Noto Sans Adlam', monospace", description: 'Monospaced layout' },
];

const SIZES = [16, 24, 32, 48, 64, 80, 96];

function FontsScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [previewText, setPreviewText] = useState(SAMPLE_TEXTS[0]);
    const [fontSize, setFontSize] = useState(48);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'fonts.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'fonts.desc')}</p>
                </div>

                {/* Controls */}
                <Card className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {t(language, 'fonts.preview')}
                        </label>
                        <input
                            type="text"
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                            dir="rtl"
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {SAMPLE_TEXTS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setPreviewText(s)}
                                className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                                dir="rtl"
                                style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                            >
                                {s.slice(0, 8)}...
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {t(language, 'fonts.size')}: {fontSize}px
                        </label>
                        <input
                            type="range"
                            min="16"
                            max="96"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            {SIZES.map(s => (
                                <button key={s} onClick={() => setFontSize(s)} className="hover:text-amber-600">{s}</button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Font Previews */}
                <div className="space-y-4">
                    {FONT_STYLES.map((font) => (
                        <Card key={font.name} hover>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{font.name}</h3>
                                    <p className="text-xs text-gray-500">{font.description}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                                    {fontSize}px
                                </span>
                            </div>
                            <div
                                dir="rtl"
                                className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-auto"
                                style={{
                                    fontFamily: font.family,
                                    fontSize: `${fontSize}px`,
                                    fontWeight: font.weight || 'normal',
                                    lineHeight: 1.4,
                                }}
                            >
                                {previewText || '...'}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Character Map */}
                <Card>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">{t(language, 'fonts.charMap')}</h3>
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2" dir="rtl">
                        {Array.from({ length: 28 }, (_, i) => String.fromCodePoint(0x1E900 + i)).map((char, i) => (
                            <div
                                key={i}
                                className="aspect-square flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 text-2xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-default"
                                style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                                title={`U+${(0x1E900 + i).toString(16).toUpperCase()}`}
                            >
                                {char}
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default FontsScreen;
