import IdleService from './Idle.service';

const gracePeriod = 60;
const idleService = new IdleService(gracePeriod);

describe('registerActivity', () => {
    test('sets last active time in storage', () => {
        const spy = jest.spyOn(Cookies, 'set');
        idleService.registerActivity();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('timeRemaining', () => {
    test('active session - returns time left until idle', () => {
        const now = Date.now();
        const timeRemaining = idleService.timeRemaining(now + 10, now);
        expect(timeRemaining/*ms*/).toBe(10);
    });

    test('idle session - returns zero', () => {
        const now = Date.now();
        const timeRemaining = idleService.timeRemaining(now - 60, now);
        expect(timeRemaining).toBe(0);
    });
});

describe('idleTime', () => {
    test('returns right time', () => {
        const lastActive = idleService.registerActivity();
        expect(idleService.untilIdle()).toBe(lastActive + gracePeriod);
    });
});