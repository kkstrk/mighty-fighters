import { useEffect, useRef } from "react";

const useSmallScreen = (onSizeChange: (isSmallScreen: boolean) => void) => {
	const isSmallScreenRef = useRef(false);
	useEffect(() => {
		const checkWindowSize = () => {
			const isSmallScreen =
				window.innerHeight >= window.innerWidth && window.innerWidth <= 750;
			if (isSmallScreenRef.current !== isSmallScreen) {
				isSmallScreenRef.current = isSmallScreen;
				onSizeChange(isSmallScreen);
			}
		};
		checkWindowSize();
		window.addEventListener("resize", checkWindowSize);
		return () => {
			window.removeEventListener("resize", checkWindowSize);
		};
	}, [onSizeChange]);
};

export default useSmallScreen;
