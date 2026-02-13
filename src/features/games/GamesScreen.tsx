import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RotateCcw, Trophy } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const PAIRS = [
    { adlam: '𞤀', latin: 'A' }, { adlam: '𞤁', latin: 'D' }, { adlam: '𞤂', latin: 'L' },
    { adlam: '𞤃', latin: 'M' }, { adlam: '𞤄', latin: 'B' }, { adlam: '𞤅', latin: 'S' },
    { adlam: '𞤆', latin: 'P' }, { adlam: '𞤈', latin: 'R' }, { adlam: '𞤉', latin: 'E' },
    { adlam: '𞤊', latin: 'F' }, { adlam: '𞤋', latin: 'I' }, { adlam: '𞤐', latin: 'N' },
];

interface MemoryCard {
    id: number;
    display: string;
    pairId: number;
    type: 'adlam' | 'latin';
    matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function createCards(count: number): MemoryCard[] {
    const selected = shuffle(PAIRS).slice(0, count);
    const cards: MemoryCard[] = [];
    selected.forEach((pair, idx) => {
        cards.push({ id: idx * 2, display: pair.adlam, pairId: idx, type: 'adlam', matched: false });
        cards.push({ id: idx * 2 + 1, display: pair.latin, pairId: idx, type: 'latin', matched: false });
    });
    return shuffle(cards);
}

function GamesScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [pairCount] = useState(6);
    const [cards, setCards] = useState(() => createCards(pairCount));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [locked, setLocked] = useState(false);

    const isComplete = matchedPairs === pairCount;

    const handleCardClick = useCallback((id: number) => {
        if (locked) return;
        const card = cards.find(c => c.id === id);
        if (!card || card.matched || flipped.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setLocked(true);
            const [first, second] = newFlipped.map(fid => cards.find(c => c.id === fid)!);

            if (first.pairId === second.pairId && first.type !== second.type) {
                setCards(prev => prev.map(c => c.pairId === first.pairId ? { ...c, matched: true } : c));
                setMatchedPairs(p => p + 1);
                setFlipped([]);
                setLocked(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setLocked(false);
                }, 800);
            }
        }
    }, [cards, flipped, locked]);

    const resetGame = useCallback(() => {
        setCards(createCards(pairCount));
        setFlipped([]);
        setMoves(0);
        setMatchedPairs(0);
        setLocked(false);
    }, [pairCount]);

    // Keyboard support
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') resetGame();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [resetGame]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'games.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'games.memoryDesc')}</p>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-amber-600">{moves}</div>
                        <div className="text-xs text-gray-500">{t(language, 'games.moves')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-green-600">{matchedPairs}/{pairCount}</div>
                        <div className="text-xs text-gray-500">{t(language, 'games.pairs')}</div>
                    </div>
                </div>

                {/* Game Over */}
                {isComplete && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Card className="text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                            <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-2" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t(language, 'games.congrats')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{moves} {t(language, 'games.moves')}</p>
                            <Button variant="primary" onClick={resetGame}>
                                <RotateCcw className="w-4 h-4 mr-2" /> {t(language, 'games.playAgain')}
                            </Button>
                        </Card>
                    </motion.div>
                )}

                {/* Card Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {cards.map((card) => {
                        const isFlipped = flipped.includes(card.id) || card.matched;
                        return (
                            <motion.button
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                whileTap={{ scale: 0.95 }}
                                aria-label={isFlipped ? `Card: ${card.display}` : `Flip card ${card.id + 1}`}
                                className={`aspect-square rounded-xl text-2xl font-black transition-all duration-300 ${
                                    card.matched
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                                        : isFlipped
                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700'
                                            : 'bg-gray-100 dark:bg-gray-800 text-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600'
                                }`}
                                style={card.type === 'adlam' && isFlipped ? { fontFamily: "'Noto Sans Adlam', sans-serif", fontSize: '1.8rem' } : undefined}
                            >
                                {isFlipped ? card.display : '?'}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Reset */}
                <div className="text-center">
                    <Button variant="outline" onClick={resetGame}>
                        <RotateCcw className="w-4 h-4 mr-2" /> {t(language, 'games.playAgain')}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default GamesScreen;
