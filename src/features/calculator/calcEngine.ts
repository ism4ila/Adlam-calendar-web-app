export interface CalcState {
    display: string;
    prevValue: number | null;
    operator: string | null;
    waitingForOperand: boolean;
}

export function initialState(): CalcState {
    return { display: '0', prevValue: null, operator: null, waitingForOperand: false };
}

export function inputDigit(state: CalcState, digit: string): CalcState {
    if (state.waitingForOperand) {
        return { ...state, display: digit, waitingForOperand: false };
    }
    return { ...state, display: state.display === '0' ? digit : state.display + digit };
}

export function inputDot(state: CalcState): CalcState {
    if (state.waitingForOperand) {
        return { ...state, display: '0.', waitingForOperand: false };
    }
    if (!state.display.includes('.')) {
        return { ...state, display: state.display + '.' };
    }
    return state;
}

export function clear(): CalcState {
    return initialState();
}

export function backspace(state: CalcState): CalcState {
    if (state.display.length > 1) {
        return { ...state, display: state.display.slice(0, -1) };
    }
    return { ...state, display: '0' };
}

export function performOperation(state: CalcState, nextOperator: string): CalcState {
    const current = parseFloat(state.display);

    if (state.prevValue !== null && state.operator && !state.waitingForOperand) {
        let result: number;
        switch (state.operator) {
            case '+': result = state.prevValue + current; break;
            case '-': result = state.prevValue - current; break;
            case '×': result = state.prevValue * current; break;
            case '÷': result = current !== 0 ? state.prevValue / current : 0; break;
            default: result = current;
        }
        const resultStr = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
        return {
            display: resultStr,
            prevValue: result,
            operator: nextOperator === '=' ? null : nextOperator,
            waitingForOperand: true,
        };
    }

    return {
        ...state,
        prevValue: current,
        operator: nextOperator === '=' ? null : nextOperator,
        waitingForOperand: true,
    };
}

export function toggleSign(state: CalcState): CalcState {
    const val = parseFloat(state.display);
    return { ...state, display: (-val).toString() };
}

export function percent(state: CalcState): CalcState {
    const val = parseFloat(state.display);
    return { ...state, display: (val / 100).toString() };
}
