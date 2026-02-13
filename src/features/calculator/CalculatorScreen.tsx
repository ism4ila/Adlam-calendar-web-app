import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Delete } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { toAdlamDigits } from '../../utils/adlamDigits';

const ADLAM_DIGITS = ['𞥐', '𞥑', '𞥒', '𞥓', '𞥔', '𞥕', '𞥖', '𞥗', '𞥘', '𞥙'];

function CalculatorScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDot = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const performOperation = (nextOperator: string) => {
        const current = parseFloat(display);

        if (prevValue !== null && operator && !waitingForOperand) {
            let result: number;
            switch (operator) {
                case '+': result = prevValue + current; break;
                case '-': result = prevValue - current; break;
                case '×': result = prevValue * current; break;
                case '÷': result = current !== 0 ? prevValue / current : 0; break;
                default: result = current;
            }
            const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
            setDisplay(resultStr);
            setPrevValue(result);
        } else {
            setPrevValue(current);
        }

        setOperator(nextOperator === '=' ? null : nextOperator);
        setWaitingForOperand(true);
    };

    const toggleSign = () => {
        const val = parseFloat(display);
        setDisplay((-val).toString());
    };

    const percent = () => {
        const val = parseFloat(display);
        setDisplay((val / 100).toString());
    };

    const adlamDisplay = toAdlamDigits(display);

    const buttons = [
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '⌫', '='],
    ];

    const getButtonStyle = (btn: string) => {
        if (btn === '=' ) return 'bg-amber-500 hover:bg-amber-600 text-white text-xl font-black';
        if (['÷', '×', '-', '+'].includes(btn)) {
            const isActive = operator === btn && waitingForOperand;
            return isActive
                ? 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-xl font-black'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 text-xl font-black';
        }
        if (['C', '±', '%'].includes(btn)) return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold';
        return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 font-semibold';
    };

    const handleButton = (btn: string) => {
        if (btn >= '0' && btn <= '9') inputDigit(btn);
        else if (btn === '.') inputDot();
        else if (btn === 'C') clear();
        else if (btn === '⌫') backspace();
        else if (btn === '±') toggleSign();
        else if (btn === '%') percent();
        else performOperation(btn);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(language, 'calculator.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t(language, 'calculator.desc')}</p>
                </div>

                <Card className="!p-4">
                    {/* Display */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 text-right">
                        <div className="text-sm text-gray-400 h-5 font-adlam" dir="rtl" style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}>
                            {adlamDisplay !== display ? adlamDisplay : ''}
                        </div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white truncate">
                            {display}
                        </div>
                        {operator && prevValue !== null && (
                            <div className="text-xs text-gray-400 mt-1">
                                {prevValue} {operator}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {buttons.flat().map((btn, i) => (
                            <button
                                key={i}
                                onClick={() => handleButton(btn)}
                                aria-label={btn === '⌫' ? 'Backspace' : undefined}
                                className={`${btn === '0' ? 'col-span-1' : ''} h-14 rounded-xl transition-colors ${getButtonStyle(btn)}`}
                            >
                                {btn === '⌫' ? <Delete className="w-5 h-5 mx-auto" aria-hidden="true" /> : btn}
                            </button>
                        ))}
                    </div>

                    {/* Adlam digit reference */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between text-center" dir="rtl">
                            {ADLAM_DIGITS.map((d, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-lg font-adlam text-amber-600" style={{ fontFamily: "'Noto Sans Adlam', sans-serif" }}>{d}</span>
                                    <span className="text-[10px] text-gray-400">{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default CalculatorScreen;
