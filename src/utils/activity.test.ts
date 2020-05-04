import { getNextInterval, getSessionStatus } from './activity';
import { subtract, add } from './math';
import { DefaultInterval, ActivityStatus } from '../constants';

describe('Activity Utilities', () => {
    describe('getNextInterval', () => {
        const gracePeriod = 5000;
        test('When there is less time remaining than the interval is long, return the remaining time', () => {
            const lastActive = subtract(Date.now(), 1000);

            const interval = getNextInterval(lastActive, gracePeriod, DefaultInterval);

            expect(interval).toBeLessThan(DefaultInterval);
        });
        test('When there is more time remaining than the interval is long, return the interval', () => {
            const lastActive = Date.now();
            const interval = getNextInterval(lastActive, gracePeriod, DefaultInterval);

            expect(interval).toEqual(DefaultInterval);
        });
    });

    describe('getSessionStatus', () => {
        const gracePeriod = 1000;

        test('When there is no time remaining in the grace period, session should be `idle`', () => {
            // Session inactive for two full grace periods
            const sessionStatus = getSessionStatus(Date.now() - gracePeriod - gracePeriod, gracePeriod);

            expect(sessionStatus).toEqual(ActivityStatus.Idle);
        });
        test('When there is time remaining in the grace period, session should be `active`', () => {
            const sessionStatus = getSessionStatus(Date.now(), gracePeriod);

            expect(sessionStatus).toEqual(ActivityStatus.Active);
        });
    });
});
