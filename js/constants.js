const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const DEBUG = true;

const originalConsoleLog = console.log;
console.log = function (...args) {
	if (DEBUG) {
		originalConsoleLog.apply(console, args);
	}
};
