import React from 'react';
import { useIdleTracker } from '../useIdleTracker';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, act as actReact } from '@testing-library/react';
import { ActivityStatus } from '../constants';
import userEvent from '@testing-library/user-event';
import IdleRefComponent from '../components/IdleRefComponent';
import IdleElementComponent from '../components/IdleElementComponent';
import { TestGracePeriod } from './constants';

describe('useIdleTracker', () => {
    beforeAll(jest.useFakeTimers);
    beforeEach(jest.clearAllMocks);
    afterEach(() => {
        Date.now = realDateNow;
        jest.clearAllTimers();
    });

    const timeToElapseGracePeriod = TestGracePeriod * 2;
    const realDateNow = Date.now.bind(global.Date);

    test('When session tracking begins, the initial status should be `active`', () => {
        const { result } = renderHook(() => useIdleTracker(TestGracePeriod));

        expect(result.current).toEqual(ActivityStatus.Active);
    });
    test('When a user has been inactive for the duration of a grace period, status should be `idle`', () => {
        const { result } = renderHook(() => useIdleTracker(TestGracePeriod));

        // Implementation details spilling out, but using fake jest timers was not sufficient
        Date.now = jest.fn(() => realDateNow() + timeToElapseGracePeriod);

        // Expire our grace period
        act(() => {
            jest.advanceTimersByTime(TestGracePeriod);
        });

        expect(result.current).toEqual(ActivityStatus.Idle);
    });
    test('When a user is active before the end of a grace period, status should be `active`', () => {
        const { result } = renderHook(() => useIdleTracker(TestGracePeriod));

        // Implementation details spilling out, but using fake jest timers was not sufficient
        Date.now = jest.fn(() => realDateNow() + TestGracePeriod);

        // Register activity to our browser window
        act(() => {
            userEvent.click(document.body);
        });

        expect(result.current).toEqual(ActivityStatus.Active);
    });
    test('When an inactive user returns from idle, status should be `active`', () => {
        const { result } = renderHook(() => useIdleTracker(TestGracePeriod));

        // Implementation details spilling out, but using fake jest timers was not sufficient
        Date.now = jest.fn(() => realDateNow() + timeToElapseGracePeriod);

        // Expire our grace period
        act(() => {
            jest.advanceTimersByTime(timeToElapseGracePeriod);
        });

        expect(result.current).toEqual(ActivityStatus.Idle);

        Date.now = realDateNow;

        // Register activity to our browser window
        act(() => {
            userEvent.click(document.body);
        });

        expect(result.current).toEqual(ActivityStatus.Active);
    });
    test('When the component un-mounts, remove any remaining intervals', () => {
        const { unmount } = renderHook(() => useIdleTracker(TestGracePeriod));

        unmount();

        // If intervals were still present this function would error due to a recursive call
        expect(() => jest.runAllTimers()).not.toThrow();
    });

    test('When an element is provided, register callbacks on that element', () => {
        const { getByTestId } = render(
            <div id='activity-element' data-testid='activity-element'>
                <IdleElementComponent gracePeriod={TestGracePeriod} />
            </div>
        );
        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Active);

        // Implementation details spilling out, but using fake jest timers was not sufficient
        Date.now = jest.fn(() => realDateNow() + timeToElapseGracePeriod);

        // Expire our grace period
        actReact(() => {
            jest.runOnlyPendingTimers();
        });

        Date.now = realDateNow;

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Idle);

        // Click outside our tracked element
        actReact(() => {
            userEvent.click(document.body);
        });

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Idle);

        // Click inside the tracked element
        actReact(() => {
            userEvent.click(getByTestId('activity-element'));
        });

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Active);
    });
    test('When a ref is provided, register callbacks on that element', () => {
        const { getByTestId } = render(<IdleRefComponent gracePeriod={TestGracePeriod} />);
        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Active);

        // Implementation details spilling out, but using fake jest timers was not sufficient
        Date.now = jest.fn(() => realDateNow() + timeToElapseGracePeriod);

        // Expire our grace period
        actReact(() => {
            jest.runOnlyPendingTimers();
        });

        Date.now = realDateNow;

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Idle);

        // Click outside our tracked element
        actReact(() => {
            userEvent.click(document.body);
        });

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Idle);

        // Click inside the tracked element
        actReact(() => {
            userEvent.click(getByTestId('ref-element'));
        });

        expect(getByTestId('status')).toHaveTextContent(ActivityStatus.Active);
    });

    test('When too many elements are provided, throw an error', () => {
        const garbageRef = { current: null };

        // react-hooks error handling does NOT work...
        try {
            renderHook(() =>
                useIdleTracker(TestGracePeriod, { ref: garbageRef, element: document })
            );
        } catch (error) {
            expect(true);
        }
        expect(false);
    });
});
