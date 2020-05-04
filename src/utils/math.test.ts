import { subtract } from './math';

describe('Math utitlities', () => {
    describe('subtract', () => {
        it('should correctly subtract two integers', () => {
            expect(subtract(123456, 23456)).toEqual(100000);
        });
        it('should correctly subtract two floats', () => {
            expect(subtract(123.456, 23.456)).toEqual(100.0);
        });
    });
});
