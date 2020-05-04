import React, { Props, PropsWithoutRef, useRef, RefObject } from 'react';
import useIdleTracker from '../useIdleTracker';

export default function IdleRefComponent(props: any) {
    const { gracePeriod } = props;
    const elementRef: RefObject<HTMLDivElement> = useRef(null);
    const status = useIdleTracker(gracePeriod, { ref: elementRef });

    return (
        <>
            <div ref={elementRef} data-testid='ref-element'></div>
            <div data-testid='status'>{status}</div>
        </>
    );
}
