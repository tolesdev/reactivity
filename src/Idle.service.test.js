import IdleService from './Idle.service';

const gracePeriod = 1000;
const idleService = new IdleService(gracePeriod);

describe('registerActivity', () => {
    test('sets last active time in storage', () => {
        const spy = jest.spyOn(idleService.storage, 'set');
        idleService.registerActivity();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('timeRemaining', () => {
    beforeEach(() => idleService.registerActivity());

    test('active session - returns time left until idle', () => {
        const now = Date.now();
        const timeRemaining = idleService.timeRemaining(now);
        expect(timeRemaining/*ms*/).toBe(1000);
    });

    test('idle session - returns zero', () => {
        const now = Date.now();
        const timeRemaining = idleService.timeRemaining(now + 6000);
        expect(timeRemaining).toBe(0);
    });
});