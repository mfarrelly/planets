import { useRef, useEffect } from "react";

/**
 * Converts a forwarded ref, which may be a callback, to a ref object.
 */
export function useForwardRef<T>(
    forwardRef?: React.Ref<T>
): React.RefObject<T> {
    const ref = useRef<T | null>(
        forwardRef && typeof forwardRef === "object" ? forwardRef.current : null
    );

    useEffect(() => {
        syncForwardRef(forwardRef, ref.current);
        return () => syncForwardRef(forwardRef, null);
    }, [forwardRef]);

    return ref;
}

/**
 * Updates a forwarded ref based on the value of another ref object.
 */
export function syncForwardRef<T>(
    forwardRef: React.Ref<T> | undefined,
    value: T | null
): void {
    if (!forwardRef) {
        return;
    }
    if (typeof forwardRef === "function") {
        forwardRef(value);
    } else {
        (forwardRef as React.MutableRefObject<T | null>).current = value;
    }
}
