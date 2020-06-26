import React from 'react';
import { useIdleTracker } from '../useIdleTracker';

export default function IdleElementComponent(props: any) {
    const { gracePeriod } = props;
    const element = () => document.getElementById('activity-element');
    const status = useIdleTracker(gracePeriod, { element });

    return <div data-testid='status'>{status}</div>;
}
