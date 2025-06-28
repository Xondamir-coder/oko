import gsap from 'gsap';
import { CustomEase, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export const defaultScrollTrigger = (trigger, options) => ({
	scrollTrigger: {
		trigger,

		// Default values
		start: '10% bottom',
		end: 'bottom 90%',
		scrub: 1,

		// You can override any ScrollTrigger options here
		...options
	}
});

export const GSAPScrub = (trigger, { method = 'from', animProps, scrollTriggerOptions }) => {
	if (!gsap) {
		console.log('GSAP instance not found');
		return;
	}

	const validMethods = ['from', 'to'];
	if (!validMethods.includes(method)) {
		console.log(`Invalid GSAP method: ${method}`);
		return;
	}

	if (!trigger || (typeof trigger === 'string' && !document.querySelector(trigger))) {
		console.log(`${trigger} not found in DOM`);
		return;
	}

	return gsap[method](trigger, {
		// Default values
		opacity: method === 'from' ? 0 : 1,

		// You can override any GSAP options here
		...animProps,
		...defaultScrollTrigger(trigger, scrollTriggerOptions)
	});
};

export const GSAPOnce = (trigger, props, scrollTriggerOptions, method = 'from') => {
	if (!gsap) {
		console.log('GSAP instance not found');
		return;
	}

	const validMethods = ['from', 'to'];
	if (!validMethods.includes(method)) {
		console.log(`Invalid GSAP method: ${method}`);
		return;
	}

	if (!trigger || (typeof trigger === 'string' && !document.querySelector(trigger))) {
		console.log(`${trigger} not found in DOM`);
		return;
	}

	return gsap[method](trigger, {
		// Default values
		...(method === 'from' ? { opacity: 0 } : {}),

		// You can override any GSAP options here
		...props,
		scrollTrigger: {
			trigger,
			start: '10% bottom',
			...(scrollTriggerOptions ? scrollTriggerOptions : {})
		}
	});
};
