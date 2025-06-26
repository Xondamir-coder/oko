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

export const GSAPAnimation = (trigger, { method = 'from', animProps, scrollTriggerOptions }) => {
	if (!gsap) {
		console.log('GSAP instance not found in Nuxt app');
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
