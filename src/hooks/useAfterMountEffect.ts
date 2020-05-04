import React, { useState, useEffect } from 'react';

/**
 * useEffect that only runs after the initial mount.
 *
 * @param {(...p: any[]) => any} useEffectCb useEffect callback
 * @param {Array<any>} deps useEffect dependency array
 */
function useAfterMountEffect(useEffectCb: (...p: any[]) => any, deps: Array<any>) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count > 0) {
            useEffectCb();
        } else {
            setCount((count) => count + 1);
        }
    }, [deps]);
}

export default useAfterMountEffect;
