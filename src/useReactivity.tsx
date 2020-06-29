import React, { useState, useRef, useEffect } from 'react';
import { IdleTrackerOptions } from './useIdleTracker';
import { useIdleTracker } from './useIdleTracker';
import { ActivityStatus } from './constants';

const isFunction = (value: any) => typeof value === 'function';

/**
 * Provides easy to use event handlers for user activity events.
 *
 * @param {number} gracePeriod The allowed duration before a session is considering idle
 * @param {IdleTrackerOptions} [props] Options for session tracking
 * @returns {ReactivityHandlers} [onIdle, onActive]
 */
export function useReactivity(gracePeriod: number, props?: IdleTrackerOptions) {
    const [idleCallback, setIdleCallback] = useState(() => () => {});
    const [activeCallback, setActiveCallback] = useState(() => () => {});
    const setOnIdle = (cb: (...p: any[]) => any) => setIdleCallback(cb);
    const setOnActive = (cb: (...p: any[]) => any) => setActiveCallback(cb);

    const idleStatus = useIdleTracker(gracePeriod, props);

    const [previousStatus, setPreviousStatus] = useState<ActivityStatus>(idleStatus);

    useEffect(() => {
        if (previousStatus !== idleStatus) {
            // Idle status has changed, update our previous status
            setPreviousStatus(idleStatus);

            if (idleStatus === ActivityStatus.Active) {
                if (isFunction(activeCallback)) {
                    activeCallback();
                }
            }
            if (idleStatus === ActivityStatus.Idle) {
                if (isFunction(idleCallback)) {
                    idleCallback();
                }
            }
        }
    }, [idleStatus]);

    return [setOnIdle, setOnActive];
}
