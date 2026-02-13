import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Banana, Trophy, RotateCcw, Play } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const ALPHABET = [
    { adlam: '𞤀', latin: 'A' }, { adlam: '𞤁', latin: 'D' }, { adlam: '𞤂', latin: 'L' },
    { adlam: '𞤃', latin: 'M' }, { adlam: '𞤄', latin: 'B' }, { adlam: '𞤅', latin: 'S' },
    { adlam: '𞤆', latin: 'P' }, { adlam: '𞤈', latin: 'R' }, { adlam: '𞤉', latin: 'E' },
    { adlam: '𞤊', latin: 'F' }, { adlam: '𞤋', latin: 'I' }, { adlam: '𞤐', latin: 'N' },
    { adlam: '𞤑', latin: 'K' }, { adlam: '𞤒', latin: 'Y' }, { adlam: '𞤔', latin: 'J' },
    { adlam: '𞤖', latin: 'H' }, { adlam: '𞤘', latin: 'G' }, { adlam: '𞤚', latin: 'T' },
];

type GameState = 'idle' | 'playing' | 'over';

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const GAME_DURATION = 30;
const OPTIONS_COUNT = 4;

function NanoBananaScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [gameState, setGameState] = useState<GameState>('idle');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [currentTarget, setCurrentTarget] = useState<{ adlam: string; latin: string } | null>(null);
    const [options, setOptions] = useState<{ adlam: string; latin: string }[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const generateRound = useCallback(() => {
        const shuffled = shuffle(ALPHABET);
        const target = shuffled[0];
        const others = shuffled.slice(1, OPTIONS_COUNT);
        const allOptions = shuffle([target, ...others]);
        setCurrentTarget(target);
        setOptions(allOptions);
        setFeedback(null);
    }, []);

    const startGame = useCallback(() => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameState('playing');
        generateRound();
    }, [generateRound]);

    useEffect(() => {
        if (gameState !== 'playing') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('over');
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [gameState]);

    const handleChoice = (choice: { adlam: string; latin: string }) => {
        if (gameState !== 'playing' || feedback) return;
        if (choice.adlam === currentTarget?.adlam) {
            setScore(s => s + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }
        setTimeout(() => generateRound(), 400);
    };

    const progressPercent = (timeLeft / GAME_DURATION) * 100;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <Banana className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            {t(language, 'nanobanana.title')}
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'nanobanana.desc')}</p>
                </div>

                {/* Idle */}
                {gameState === 'idle' && (
                    <Card className="text-center space-y-6">
                        <div className="text-6xl">🍌</div>
                        <p className="text-gray-600 dark:text-gray-400">{t(language, 'nanobanana.desc')}</p>
                        <Button variant="primary" size="lg" onClick={startGame}>
                            <Play className="w-5 h-5 mr-2" /> {t(language, 'nanobanana.start')}
                        </Button>
                    </Card>
                )}

                {/* Playing */}
                {gameState === 'playing' && currentTarget && (
                    <>
                        {/* Stats bar */}
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-black text-amber-600">
                                {t(language, 'nanobanana.score')}: {score}
                            </div>
                            <div className={`text-lg font-black ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-300'}`}>
                                {t(language, 'nanobanana.time')}: {timeLeft}s
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'}`}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Target */}
                        <Card className="text-center">
                            <p className="text-sm text-gray-500 mb-2">{t(language, 'nanobanana.tap')}: <strong>{currentTarget.latin}</strong></p>
                            <div className="text-5xl font-black text-gray-900 dark:text-white">
                                {currentTarget.latin}
                            </div>
                        </Card>

                        {/* Options grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <AnimatePresence mode="popLayout">
                                {options.map((opt) => (
                                    <motion.button
                                        key={opt.adlam}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={opt.latin}
                                        onClick={() => handleChoice(opt)}
                                        className={`p-6 rounded-2xl text-4xl font-black transition-colors border-2 ${
                                            feedback && opt.adlam === currentTarget.adlam
                                                ? 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-700 dark:text-green-300'
                                                : feedback === 'wrong' && opt.adlam !== currentTarget.adlam
                                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 text-gray-900 dark:text-white'
                                        }`}
                                        style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}
                                    >
                                        {opt.adlam}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}

                {/* Game Over */}
                {gameState === 'over' && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Card className="text-center space-y-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
                            <Trophy className="w-16 h-16 mx-auto text-amber-500" />
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white">{t(language, 'nanobanana.gameOver')}</h2>
                            <div className="text-5xl font-black text-amber-600">{score}</div>
                            <p className="text-gray-600 dark:text-gray-400">{t(language, 'nanobanana.finalScore')}</p>
                            <div className="flex gap-3 justify-center">
                                <Button variant="primary" size="lg" onClick={startGame}>
                                    <RotateCcw className="w-5 h-5 mr-2" /> {t(language, 'nanobanana.playAgain')}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default NanoBananaScreen;
