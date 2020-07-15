import React, { useState, useRef, useEffect, MutableRefObject, RefObject, Ref } from 'react';
import { ActivityStatus, DefaultInterval, ActivityEvents } from './constants';
import { getNextInterval, getSessionStatus } from './utils/activity';

export interface IdleTrackerOptions {
    /** The frequency which to check and update our session activity status. */
    interval?: number;
    /** Sync all idle tracking across multiple sessions in a browser. */
    syncSessions?: boolean;
    /** DOM element or React component to be tracked. */
    element?: React.ReactNode;
    /** DOM element or React component to be tracked if unable to find desired element. */
    fallbackElement?: React.ReactNode;
    /** React `ref` of the element to be tracked. */
    ref?: Ref<EventTarget>;
}

export function useIdleTracker(gracePeriod: number, options?: IdleTrackerOptions): ActivityStatus;
/**
 * Track session interactivity status.
 * See the list of events in the documentation.
 *
 * @param {number} gracePeriod
 * @param {IdleTrackerOptions} [options]
 * @returns {ActivityStatus}
 */
export function useIdleTracker(
    gracePeriod: number,
    options: IdleTrackerOptions = {}
): ActivityStatus {
    const {
        syncSessions = false,
        element,
        ref,
        interval = DefaultInterval,
        fallbackElement = window,
    } = options;

    const [status, setStatus] = useState<ActivityStatus>(ActivityStatus.Active);
    let { current: lastActive }: MutableRefObject<number> = useRef(Date.now());
    let { current: idleTimer }: MutableRefObject<NodeJS.Timeout | undefined> = useRef();

    const createInterval = (syncLastActive?: string) => {
        idleTimer = setInterval(() => {
            let currentStatus = null;

            // Check for cross-tab compatibility
            if (syncSessions) {
                // Grab our session information from our global storage
                const syncSessionLastActive =
                    localStorage.getItem('reactivity:session') ?? syncLastActive;

                if (syncSessionLastActive) {
                    // If a session is being tracked, get the current status
                    currentStatus = getSessionStatus(syncSessionLastActive, gracePeriod);
                } else {
                    // If there is no activity information present, we can only assume the session is idle
                    currentStatus = ActivityStatus.Idle;
                }
            } else {
                // Get status for a single page session
                currentStatus = getSessionStatus(lastActive, gracePeriod);
            }
            setStatus(currentStatus);
        }, getNextInterval(lastActive, gracePeriod, interval ?? DefaultInterval));
    };

    const removeInterval = () => {
        if (idleTimer) {
            clearInterval(idleTimer);
        }
    };

    const handleActivity = () => {
        // Short circuit logic will skip updating if the value is unchanged
        setStatus(ActivityStatus.Active);
        // Register the time of the last session activity
        if (!syncSessions) {
            lastActive = Date.now();
        } else {
            localStorage.setItem('reactivity:session', Date.now().toString());
        }
    };

    /** ON MOUNT */
    useEffect(() => {
        const syncLastActive = Date.now().toString();
        if (syncSessions) {
            localStorage.setItem('reactivity:session', syncLastActive);
        }
        // Create our initial interval to check session activity
        createInterval(syncLastActive);
        // Clear intervals on un-mount
        return () => removeInterval();
    }, []);

    /** REGISTER ACTIVITY EVENT HANDLERS */
    useEffect(() => {
        let resolvedElement: any = element || ref;

        if (element && ref) {
            throw Error(
                'More than one element option was provided, please provide one of: element, elementId or ref.'
            );
        } else {
            if (resolvedElement) {
                if (resolvedElement.current) {
                    resolvedElement = resolvedElement.current;
                }
                if (typeof resolvedElement === 'function') {
                    resolvedElement = resolvedElement();
                }
            } else {
                resolvedElement = fallbackElement;
            }

            if (resolvedElement) {
                ActivityEvents.forEach((event) => {
                    (resolvedElement as EventTarget).addEventListener(event, handleActivity);
                });
            }
        }

        return () => {
            ActivityEvents.forEach((event) => {
                (resolvedElement as EventTarget).removeEventListener(event, handleActivity);
            });
        };
    }, []);

    return status;
}
