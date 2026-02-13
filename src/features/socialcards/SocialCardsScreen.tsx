import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, Copy } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const TEMPLATES = [
    { name: 'Gold', bg: 'from-amber-500 to-orange-600', text: 'text-white', bgCss: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
    { name: 'Night', bg: 'from-gray-900 to-gray-800', text: 'text-amber-400', bgCss: 'linear-gradient(135deg, #1e293b, #1f2937)' },
    { name: 'Green', bg: 'from-emerald-500 to-teal-600', text: 'text-white', bgCss: 'linear-gradient(135deg, #10b981, #0d9488)' },
    { name: 'Purple', bg: 'from-violet-600 to-purple-700', text: 'text-white', bgCss: 'linear-gradient(135deg, #7c3aed, #7e22ce)' },
    { name: 'Sky', bg: 'from-sky-400 to-blue-600', text: 'text-white', bgCss: 'linear-gradient(135deg, #38bdf8, #2563eb)' },
    { name: 'Rose', bg: 'from-rose-500 to-pink-600', text: 'text-white', bgCss: 'linear-gradient(135deg, #f43f5e, #db2777)' },
];

const SAMPLE_QUOTES = [
    '𞤔𞤢𞤢𞤪𞤢𞤥𞤢',
    '𞤀𞤣𞤤𞤢𞤥 𞤳𞤮 𞤢𞤤𞤳𞤵𞤤𞤫 𞤥𞤫𞤲',
    '𞤖𞤢𞤤𞤢 𞤫 𞤶𞤢𞤥',
];

function SocialCardsScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [quote, setQuote] = useState(SAMPLE_QUOTES[0]);
    const [author, setAuthor] = useState('');
    const [templateIdx, setTemplateIdx] = useState(0);
    const [copied, setCopied] = useState(false);

    const template = TEMPLATES[templateIdx];

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1200;
        canvas.height = 630;

        // Parse gradient colors from bgCss
        const colors = template.bgCss.match(/#[0-9a-f]{6}/gi) || ['#f59e0b', '#ea580c'];
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decorative quotes
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.font = 'bold 200px serif';
        ctx.textAlign = 'left';
        ctx.fillText('"', 40, 180);

        // Main quote
        const textColor = template.name === 'Night' ? '#fbbf24' : '#ffffff';
        ctx.fillStyle = textColor;
        ctx.font = `bold 48px 'Noto Sans Adlam', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.direction = 'rtl';

        const lines = quote.split('\n');
        const lineHeight = 70;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2 - (author ? 20 : 0);
        lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
        });

        // Author
        if (author) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = `28px 'Noto Sans Adlam', sans-serif`;
            ctx.fillText(`— ${author}`, canvas.width / 2, startY + lines.length * lineHeight + 20);
        }

        // Watermark
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.direction = 'ltr';
        ctx.fillText('Adlam Tech Space', canvas.width - 30, canvas.height - 20);

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adlam-card.png';
        a.click();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(quote + (author ? `\n— ${author}` : ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'socialcards.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'socialcards.desc')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Controls */}
                    <Card className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(language, 'socialcards.quote')}
                            </label>
                            <textarea
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                dir="rtl"
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none h-24"
                                style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(language, 'socialcards.author')}
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                dir="rtl"
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {t(language, 'socialcards.template')}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {TEMPLATES.map((tmpl, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setTemplateIdx(i)}
                                        className={`h-10 rounded-lg bg-gradient-to-r ${tmpl.bg} transition-all ${templateIdx === i ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-gray-800 scale-105' : ''}`}
                                    >
                                        <span className={`text-xs font-bold ${tmpl.text}`}>{tmpl.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick quotes */}
                        <div className="flex flex-wrap gap-2">
                            {SAMPLE_QUOTES.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setQuote(q)}
                                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                                    style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                                    dir="rtl"
                                >
                                    {q.slice(0, 10)}...
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="primary" onClick={handleDownload} className="flex-1">
                                <Download className="w-4 h-4 mr-2" /> {t(language, 'socialcards.download')}
                            </Button>
                            <Button variant="outline" onClick={handleCopy}>
                                <Copy className="w-4 h-4 mr-1" /> {copied ? t(language, 'translator.copied') : t(language, 'socialcards.copy')}
                            </Button>
                        </div>
                    </Card>

                    {/* Preview */}
                    <div
                        className={`rounded-2xl flex flex-col items-center justify-center p-10 aspect-[1200/630] bg-gradient-to-br ${template.bg} shadow-lg`}
                    >
                        <div className="text-6xl opacity-10 font-serif mb-2">"</div>
                        <div
                            dir="rtl"
                            className={`text-2xl md:text-3xl font-bold text-center ${template.text} leading-relaxed whitespace-pre-line`}
                            style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                        >
                            {quote || '...'}
                        </div>
                        {author && (
                            <div className={`mt-4 text-sm ${template.text} opacity-70`} style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }} dir="rtl">
                                — {author}
                            </div>
                        )}
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </motion.div>
        </div>
    );
}

export default SocialCardsScreen;
