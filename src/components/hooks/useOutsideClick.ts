"use client";

import { useEffect } from "react";

export function useOutsideClick(
	ref: React.RefObject<HTMLElement>,
	handler: () => void,
	excludeRef?: React.RefObject<HTMLElement>,
) {
	useEffect(() => {
		function handleClick(event: MouseEvent) {
			const target = event.target as Node;

			// If click inside main ref → ignore
			if (ref.current && ref.current.contains(target)) return;

			// If click inside excluded ref (like toggle button) → ignore
			if (excludeRef?.current && excludeRef.current.contains(target)) return;

			handler();
		}

		document.addEventListener("mousedown", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [ref, handler, excludeRef]);
}
