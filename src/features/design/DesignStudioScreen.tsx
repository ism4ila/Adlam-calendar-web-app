import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const GRADIENTS = [
    { name: 'Sunset', from: '#f59e0b', to: '#ea580c' },
    { name: 'Ocean', from: '#3b82f6', to: '#06b6d4' },
    { name: 'Forest', from: '#10b981', to: '#059669' },
    { name: 'Purple', from: '#8b5cf6', to: '#a855f7' },
    { name: 'Rose', from: '#f43f5e', to: '#ec4899' },
    { name: 'Night', from: '#1e293b', to: '#0f172a' },
    { name: 'Gold', from: '#d97706', to: '#b45309' },
    { name: 'Teal', from: '#14b8a6', to: '#0d9488' },
];

function DesignStudioScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [text, setText] = useState('𞤀𞤣𞤤𞤢𞤥');
    const [selectedGradient, setSelectedGradient] = useState(0);
    const [textColor, setTextColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(64);

    const gradient = GRADIENTS[selectedGradient];

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 1080;
        canvas.height = 1080;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, gradient.from);
        grad.addColorStop(1, gradient.to);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize * 2}px 'Noto Sans Adlam', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.direction = 'rtl';

        // Word wrap
        const lines = text.split('\n');
        const lineHeight = fontSize * 2.4;
        const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
        });

        // Watermark
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.direction = 'ltr';
        ctx.fillText('Adlam Tech Space', canvas.width - 30, canvas.height - 20);

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'adlam-design.png';
        a.click();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'design.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'design.desc')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Controls */}
                    <Card className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(language, 'design.text')}
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                dir="rtl"
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none h-24"
                                style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {t(language, 'design.background')}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {GRADIENTS.map((g, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedGradient(i)}
                                        className={`h-10 rounded-lg transition-all ${selectedGradient === i ? 'ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-gray-800 scale-105' : ''}`}
                                        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                                        title={g.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t(language, 'design.textColor')}
                                </label>
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                                    className="w-full h-10 rounded-lg cursor-pointer" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t(language, 'design.fontSize')} ({fontSize}px)
                                </label>
                                <input type="range" min="24" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full mt-2" />
                            </div>
                        </div>

                        <Button variant="primary" onClick={handleDownload} className="w-full">
                            <Download className="w-5 h-5 mr-2" /> {t(language, 'design.download')}
                        </Button>
                    </Card>

                    {/* Preview */}
                    <div className="flex flex-col gap-4">
                        <div
                            className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                        >
                            <div
                                dir="rtl"
                                className="text-center px-8 break-words w-full whitespace-pre-line"
                                style={{
                                    color: textColor,
                                    fontSize: `${fontSize}px`,
                                    fontFamily: "'Noto Sans Adlam', sans-serif",
                                    fontWeight: 'bold',
                                    lineHeight: 1.4,
                                }}
                            >
                                {text || '...'}
                            </div>
                        </div>
                    </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </motion.div>
        </div>
    );
}

export default DesignStudioScreen;
