import React from 'react';
import Idle from './Idle';
import { mount } from 'enzyme';

beforeAll(() => {
    jest.useFakeTimers();
});

// describe.only('intervals', () => {
//     test('activity', () => {
//         const mockOnIdle = jest.fn();
//         const gracePeriod = 2000;
//         const wrapper = mount(
//             <Idle
//                 onIdle={mockOnIdle}
//                 gracePeriod={gracePeriod}
//                 element={document} />
//         );
//         // Go idle
//         jest.advanceTimersByTime(gracePeriod * 10);

//         expect(mockOnIdle).toBeCalledTimes(1);
//     });
//     test('idle', () => {
//         const mockOnReturn = jest.fn();
//         const mockOnIdle = jest.fn();
//         const mockOnActive = jest.fn();
//         const gracePeriod = 2000;
//         const eventMap = {};
//         document.addEventListener = jest.fn((event, cb) => {
//             eventMap[event] = cb;
//         });
//         const wrapper = mount(
//             <Idle
//                 onActive={mockOnActive}
//                 onIdle={mockOnIdle}
//                 onReturn={mockOnReturn}
//                 gracePeriod={gracePeriod}
//                 element={document} />
//         );
//         // Go idle
//         jest.advanceTimersByTime(gracePeriod * 10);
//         // Return from idle
//         eventMap.click();

//         expect(wrapper.state().isIdle).toBeFalsy();
//         expect(mockOnActive).toHaveBeenCalled();
//         expect(mockOnIdle).toHaveBeenCalled();
//         expect(mockOnReturn).toBeCalledTimes(1);
//     });
// });

describe('eventListeners', () => {
    test('register activity', () => {
        const mockOnActive = jest.fn();
        const eventMap = {};
        document.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });

        mount(
            <Idle
                onActive={mockOnActive}
                gracePeriod={10000}
                element={document}
            />
        );
        eventMap.keypress();
        expect(mockOnActive.mock.calls.length).toBe(1);
    });

    test('unregister on unmount', () => {
        const eventMap = {};
        document.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });
        document.removeEventListener = jest.fn((event, cb) => {
            delete eventMap[event];
        });

        const wrapper = mount(
            <Idle
                gracePeriod={10000}
                element={document}
            />
        );
        wrapper.unmount();

        expect(Object.keys(eventMap)).toHaveLength(0);
    });
});