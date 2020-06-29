import { add, subtract } from './math';
import { ActivityStatus } from '../constants';

/**
 * Return the next interval time (ms)
 * Specifically handles the scenario where our interval is greater than the time remaining before inactivity.
 *
 * @export
 * @param {number} lastActive Epoch time representing the last session activity
 * @param {number} interval Interval at which we check for inactivity
 * @returns {number} nextInterval
 */
export function getNextInterval(lastActive: number, gracePeriod: number, interval: number) {
    const timeRemaining = subtract(add(lastActive, gracePeriod), Date.now());
    return timeRemaining <= interval ? timeRemaining : interval;
}

/**
 * Get the status of the current session
 *
 * @export
 * @param {number} lastActive Epoch time representing the last session activity
 * @returns {ActivityStatus} Idle or Active
 */
export function getSessionStatus(lastActive: number | string, gracePeriod: number) {
    const idleTimeElapsed = subtract(Date.now(), lastActive);
    if (idleTimeElapsed <= gracePeriod) {
        return ActivityStatus.Active;
    }
    return ActivityStatus.Idle;
}
