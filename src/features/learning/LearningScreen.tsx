import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { BookOpen, Hash, Trophy, RotateCcw, ChevronRight, Check, X } from 'lucide-react';

// --- Data ---
const ALPHABET = [
    { adlam: '𞤀', latin: 'A', name: 'Alif' },
    { adlam: '𞤁', latin: 'D', name: 'Dâli' },
    { adlam: '𞤂', latin: 'L', name: 'Lâm' },
    { adlam: '𞤃', latin: 'M', name: 'Mîm' },
    { adlam: '𞤄', latin: 'B', name: 'Ba' },
    { adlam: '𞤅', latin: 'S', name: 'Sin' },
    { adlam: '𞤆', latin: 'P', name: 'Pe' },
    { adlam: '𞤇', latin: 'Bh', name: 'Bhe' },
    { adlam: '𞤈', latin: 'R', name: 'Ra' },
    { adlam: '𞤉', latin: 'E', name: 'E' },
    { adlam: '𞤊', latin: 'F', name: 'Fa' },
    { adlam: '𞤋', latin: 'I', name: 'I' },
    { adlam: '𞤌', latin: 'O', name: 'O' },
    { adlam: '𞤍', latin: 'Dh', name: 'Dhe' },
    { adlam: '𞤎', latin: 'Yh', name: 'Yhe' },
    { adlam: '𞤏', latin: 'W', name: 'Waw' },
    { adlam: '𞤐', latin: 'N', name: 'Nun' },
    { adlam: '𞤑', latin: 'K', name: 'Kaf' },
    { adlam: '𞤒', latin: 'Y', name: 'Ya' },
    { adlam: '𞤓', latin: 'U', name: 'U' },
    { adlam: '𞤔', latin: 'J', name: 'Jim' },
    { adlam: '𞤕', latin: 'Ch', name: 'Chi' },
    { adlam: '𞤖', latin: 'H', name: 'Ha' },
    { adlam: '𞤗', latin: 'Q', name: 'Qaf' },
    { adlam: '𞤘', latin: 'G', name: 'Ga' },
    { adlam: '𞤙', latin: 'Ny', name: 'Nya' },
    { adlam: '𞤚', latin: 'T', name: 'Tu' },
    { adlam: '𞤛', latin: 'Nh', name: 'Nha' },
];

const DIGITS = ['𞥐', '𞥑', '𞥒', '𞥓', '𞥔', '𞥕', '𞥖', '𞥗', '𞥘', '𞥙'];

const COMMON_WORDS = [
    { adlam: '𞤖𞤢𞤤𞤢', latin: 'Hala', meaning: { en: 'Hello', fr: 'Bonjour', ar: 'مرحبا' } },
    { adlam: '𞤔𞤢𞤢𞤪𞤢𞤥𞤢', latin: 'Jaarama', meaning: { en: 'Thank you', fr: 'Merci', ar: 'شكرا' } },
    { adlam: '𞤐𞤢𞤥', latin: 'Nam', meaning: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
    { adlam: '𞤀𞤤𞤢𞥄', latin: 'Alaa', meaning: { en: 'No', fr: 'Non', ar: 'لا' } },
    { adlam: '𞤃𞤦𞤢𞤤𞤼𞤵', latin: 'Mbaltu', meaning: { en: 'Help', fr: 'Aide', ar: 'مساعدة' } },
    { adlam: '𞤐𞤣𞤭𞤴𞤢𞤥', latin: 'Ndiyam', meaning: { en: 'Water', fr: 'Eau', ar: 'ماء' } },
    { adlam: '𞤐𞤮𞤳𞥆𞤵', latin: 'Nokku', meaning: { en: 'Place', fr: 'Endroit', ar: 'مكان' } },
    { adlam: '𞤐𞤢𞥄𞤲𞤺𞤫', latin: 'Naange', meaning: { en: 'Sun', fr: 'Soleil', ar: 'شمس' } },
    { adlam: '𞤂𞤫𞤱𞤪𞤵', latin: 'Lewru', meaning: { en: 'Moon/Month', fr: 'Lune/Mois', ar: 'قمر/شهر' } },
    { adlam: '𞤆𞤵𞤤𞤢𞤢𞤪', latin: 'Pulaar', meaning: { en: 'Fulani language', fr: 'Langue Peule', ar: 'لغة الفولاني' } },
];

type Tab = 'alphabet' | 'digits' | 'quiz' | 'words';
type QuizState = 'idle' | 'question' | 'correct' | 'wrong' | 'done';

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function LearningScreen() {
    const { settings } = useSettingsStore();
    const lang = settings.language;
    const [activeTab, setActiveTab] = useState<Tab>('alphabet');

    // Quiz state
    const [quizType, setQuizType] = useState<'alpha' | 'digit'>('alpha');
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [quizIndex, setQuizIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizItems, setQuizItems] = useState<typeof ALPHABET>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    // Flash card state
    const [flipped, setFlipped] = useState<Set<number>>(new Set());

    const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
        { id: 'alphabet', label: t(lang, 'learning.alphabet'), icon: BookOpen },
        { id: 'digits', label: t(lang, 'learning.digits'), icon: Hash },
        { id: 'quiz', label: t(lang, 'learning.quiz'), icon: Trophy },
        { id: 'words', label: t(lang, 'learning.words'), icon: ChevronRight },
    ];

    const startQuiz = useCallback((type: 'alpha' | 'digit') => {
        setQuizType(type);
        const items = type === 'alpha'
            ? shuffle(ALPHABET).slice(0, 10)
            : DIGITS.map((d, i) => ({ adlam: d, latin: String(i), name: String(i) }));
        setQuizItems(items);
        setQuizIndex(0);
        setScore(0);
        setSelected(null);
        generateOptions(items, 0, type);
        setQuizState('question');
    }, []);

    const generateOptions = (items: typeof ALPHABET, idx: number, type: 'alpha' | 'digit') => {
        const correct = items[idx].latin;
        const pool = type === 'alpha'
            ? ALPHABET.map(a => a.latin)
            : DIGITS.map((_, i) => String(i));
        const wrong = shuffle(pool.filter(p => p !== correct)).slice(0, 3);
        setOptions(shuffle([correct, ...wrong]));
    };

    const handleAnswer = (answer: string) => {
        if (selected) return;
        setSelected(answer);
        const isCorrect = answer === quizItems[quizIndex].latin;
        if (isCorrect) setScore(s => s + 1);
        setQuizState(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            const next = quizIndex + 1;
            if (next >= quizItems.length) {
                setQuizState('done');
            } else {
                setQuizIndex(next);
                setSelected(null);
                generateOptions(quizItems, next, quizType);
                setQuizState('question');
            }
        }, 1200);
    };

    const toggleFlip = (index: number) => {
        setFlipped(prev => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const progressPct = useMemo(() => {
        if (quizItems.length === 0) return 0;
        return Math.round(((quizIndex + (quizState === 'done' ? 0 : 0)) / quizItems.length) * 100);
    }, [quizIndex, quizItems.length, quizState]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        {t(lang, 'learning.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t(lang, 'learning.desc')}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 gap-1">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === id
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'alphabet' && (
                        <motion.div key="alpha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                                {ALPHABET.map((letter, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        onClick={() => toggleFlip(i)}
                                        className="cursor-pointer"
                                    >
                                        <Card hover className="text-center group p-3 min-h-[120px] flex flex-col items-center justify-center">
                                            <AnimatePresence mode="wait">
                                                {!flipped.has(i) ? (
                                                    <motion.div key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.2 }}>
                                                        <div className="text-4xl font-adlam text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                                            {letter.adlam}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">{t(lang, 'learning.tapToFlip')}</div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
                                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{letter.latin}</div>
                                                        <div className="text-sm text-gray-500">{letter.name}</div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'digits' && (
                        <motion.div key="digits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto">
                                {DIGITS.map((digit, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => toggleFlip(100 + i)}
                                        className="cursor-pointer"
                                    >
                                        <Card hover className="text-center group p-4">
                                            <AnimatePresence mode="wait">
                                                {!flipped.has(100 + i) ? (
                                                    <motion.div key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: -90 }} transition={{ duration: 0.2 }}>
                                                        <div className="text-6xl font-adlam text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                                            {digit}
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
                                                        <div className="text-5xl font-bold text-gray-900 dark:text-white">{i}</div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'quiz' && (
                        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {quizState === 'idle' && (
                                <div className="text-center space-y-6 max-w-md mx-auto">
                                    <Card className="p-8">
                                        <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">{t(lang, 'learning.quizTitle')}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">{t(lang, 'learning.quizDesc')}</p>
                                        <div className="flex flex-col gap-3">
                                            <Button variant="primary" size="lg" onClick={() => startQuiz('alpha')}>
                                                <BookOpen className="w-5 h-5 mr-2" />
                                                {t(lang, 'learning.quizAlphabet')}
                                            </Button>
                                            <Button variant="outline" size="lg" onClick={() => startQuiz('digit')}>
                                                <Hash className="w-5 h-5 mr-2" />
                                                {t(lang, 'learning.quizDigits')}
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {(quizState === 'question' || quizState === 'correct' || quizState === 'wrong') && (
                                <div className="max-w-lg mx-auto space-y-6">
                                    {/* Progress */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                                                animate={{ width: `${progressPct}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500">{quizIndex + 1}/{quizItems.length}</span>
                                    </div>

                                    {/* Question */}
                                    <Card className="text-center p-8">
                                        <p className="text-sm text-gray-500 mb-2">{t(lang, 'learning.quizWhat')}</p>
                                        <div className="text-8xl font-adlam text-teal-600 dark:text-teal-400 my-6">
                                            {quizItems[quizIndex]?.adlam}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {options.map((opt) => {
                                                let btnClass = 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400';
                                                if (selected) {
                                                    if (opt === quizItems[quizIndex].latin) {
                                                        btnClass = 'bg-green-50 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-300';
                                                    } else if (opt === selected) {
                                                        btnClass = 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-300';
                                                    }
                                                }
                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => handleAnswer(opt)}
                                                        disabled={!!selected}
                                                        className={`p-4 rounded-xl text-xl font-bold transition-all ${btnClass} disabled:cursor-default`}
                                                    >
                                                        {opt}
                                                        {selected && opt === quizItems[quizIndex].latin && <Check className="w-5 h-5 inline ml-2 text-green-500" />}
                                                        {selected && opt === selected && opt !== quizItems[quizIndex].latin && <X className="w-5 h-5 inline ml-2 text-red-500" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Card>

                                    {/* Score */}
                                    <div className="text-center text-sm text-gray-500">
                                        {t(lang, 'learning.score')}: <span className="font-bold text-teal-600">{score}</span>/{quizIndex + (selected ? 1 : 0)}
                                    </div>
                                </div>
                            )}

                            {quizState === 'done' && (
                                <div className="text-center max-w-md mx-auto">
                                    <Card className="p-8">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                            <div className="text-6xl mb-4">
                                                {score >= quizItems.length * 0.8 ? '🏆' : score >= quizItems.length * 0.5 ? '👏' : '💪'}
                                            </div>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold mb-2">{t(lang, 'learning.quizDone')}</h3>
                                        <p className="text-4xl font-black text-teal-600 my-4">{score}/{quizItems.length}</p>
                                        <p className="text-gray-500 mb-6">
                                            {score === quizItems.length
                                                ? t(lang, 'learning.perfect')
                                                : score >= quizItems.length * 0.7
                                                ? t(lang, 'learning.great')
                                                : t(lang, 'learning.keepGoing')}
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <Button variant="primary" onClick={() => startQuiz(quizType)}>
                                                <RotateCcw className="w-4 h-4 mr-2" /> {t(lang, 'learning.retry')}
                                            </Button>
                                            <Button variant="outline" onClick={() => setQuizState('idle')}>
                                                {t(lang, 'learning.quizMenu')}
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'words' && (
                        <motion.div key="words" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                {COMMON_WORDS.map((word, i) => {
                                    const meaningLang = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en';
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card hover className="flex items-center gap-4 p-4">
                                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0">
                                                    <span className="text-2xl font-adlam text-white">{word.adlam.slice(0, 2)}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xl font-adlam text-teal-700 dark:text-teal-300 truncate">{word.adlam}</div>
                                                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{word.latin}</div>
                                                    <div className="text-xs text-gray-500">{word.meaning[meaningLang]}</div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* About Adlam */}
                <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-800">
                    <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-4">{t(lang, 'learning.about')}</h3>
                    <p className="text-teal-800 dark:text-teal-200 leading-relaxed">
                        {t(lang, 'learning.aboutDesc')}
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

export default LearningScreen;
