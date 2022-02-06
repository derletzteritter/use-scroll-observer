import { MutableRefObject, useCallback, useEffect, useMemo } from 'react';

interface IScrollbarObserver {
	ref: MutableRefObject<any>;
	callback: () => void;
	intersectionOptions?: IntersectionObserverInit;
}

/**
 * @param ref
 * @param callback
 * @param timeout
 */
export const useScrollObserver = ({ ref, callback, intersectionOptions }: IScrollbarObserver) => {
	const handleObserver = useCallback((entities: IntersectionObserverEntry[]) => {
		const target = entities[0];
		
		if (target.isIntersecting) {
			callback();
		}
	}, [callback]);
	
	const options: IntersectionObserverInit = useMemo(() => ({
		root: intersectionOptions?.root || null,
		rootMargin: intersectionOptions?.rootMargin || "20px",
		threshold: intersectionOptions?.threshold || 0.5
	}), []);
	
	const observer = useMemo(() => new IntersectionObserver(handleObserver, options), [handleObserver, options]);
	
	useEffect(() => {
		if (ref?.current) {
			observer.observe(ref.current)
		}
		
		return () => observer.unobserve(ref?.current)
	}, [ref, observer]);
}