import { useReactivity } from '../useReactivity';
import { renderHook, act } from '@testing-library/react-hooks';
import { TestGracePeriod } from './constants';
import userEvent from '@testing-library/user-event';

describe('useReactivity', () => {
    const idleSpy = jest.fn();
    const activeSpy = jest.fn();

    beforeAll(jest.useFakeTimers);
    beforeEach(jest.clearAllMocks);
    afterEach(jest.clearAllTimers);

    test('When the user is idle, fire the idle event only once', () => {
        const { result } = renderHook(() => useReactivity(TestGracePeriod));

        const [onIdle] = result.current;

        act(() => {
            onIdle(idleSpy);
        });

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(idleSpy).toHaveBeenCalledTimes(1);
    });
    test('When the user remains idle beyond the grace period, no further idle events are called', async () => {
        const { result } = renderHook(() => useReactivity(TestGracePeriod));

        const [onIdle] = result.current;

        act(() => {
            onIdle(idleSpy);
        });

        act(() => {
            // Entire idle state
            jest.runOnlyPendingTimers();
            // Reset our mock that has been called once
            idleSpy.mockClear();

            // Run several cycles of our idle trackers
            jest.runOnlyPendingTimers();
            jest.runOnlyPendingTimers();
            jest.runOnlyPendingTimers();
        });

        expect(idleSpy).toHaveBeenCalledTimes(0);
    });
    test('When a user is active, fire the active event only once', () => {
        const { result } = renderHook(() => useReactivity(TestGracePeriod));

        const [, onActive] = result.current;

        act(() => {
            onActive(activeSpy);
        });

        act(() => {
            jest.runOnlyPendingTimers();
            userEvent.click(document.body);
        });

        expect(activeSpy).toHaveBeenCalledTimes(1);
    });

    test('When the user remains idle beyond the grace period, no further idle events are called', async () => {
        const { result } = renderHook(() => useReactivity(TestGracePeriod));

        const [, onActive] = result.current;

        act(() => {
            onActive(activeSpy);
        });

        act(() => {
            // Entire idle state
            jest.runOnlyPendingTimers();
            // Reset our mock that has been called once
            activeSpy.mockClear();
        });

        expect(activeSpy).toHaveBeenCalledTimes(0);
    });
});
