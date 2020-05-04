import Big from 'big.js';
import { isNumber, isString } from 'util';

/**
 * Subtract two numbers with float precision safety.
 * @param operands (lhs, rhs)
 */
export function subtract(...operands: Array<number | string>) {
    const [lhs, rhs] = operands;
    if (operands.every((op) => isNumber(op) || isString(op))) {
        const result = Big(lhs).minus(rhs).valueOf();
        return parseFloat(result);
    }
    throw Error(`Invalid arguments: subtract(${lhs}, ${rhs})`);
}

/**
 * Add two numbers with float precision safety.
 * @param operands (lhs, rhs)
 */
export function add(...operands: Array<number | string>) {
    const [lhs, rhs] = operands;
    if (operands.every((op) => isNumber(op) || isString(op))) {
        const result = Big(lhs).plus(rhs).valueOf();
        return parseFloat(result);
    }
    throw Error(`Invalid arguments, add(${lhs}, ${rhs})`);
}
