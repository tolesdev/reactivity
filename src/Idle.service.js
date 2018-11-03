import Storage from './utils/storage';

export default class IdleService {
    constructor (gracePeriod) {
        this.storage = new Storage();
        this.gracePeriod = gracePeriod;
    }
    /**
     * Registers a users activity by updating their last known activity.
     * @returns {number} lastActive - The Epoch date/time (ms) of last activity recorded.
     */
    registerActivity = () => {
        const now = Date.now();
        this.storage.set('lastactive', now);
        return now;
    }
    /**
     * Gets the remaining time until the the session is idle.
     * @param {number} [now] - The Date to be used for the current time when calculating time remaining.
     * @returns {number} Time (ms) until the session is idle.
     */
    timeRemaining = (now = Date.now()) => {
        const timeRemaining = this.lastActivity() + this.gracePeriod - now;
        return timeRemaining > 0 ? timeRemaining : 0;
    }
    /**
     * Gets the last time of activity for the current session.
     * @returns {number} Last known active time (ms).
     */
    lastActivity = () => {
        return parseInt(this.storage.get('lastactive'), 10);
    }
}