import { GSAPOnce, GSAPScrub } from './gsap';

/**
 * Splits an element’s text & children into word-wrapped spans (preserving <br> and existing <span>),
 * and returns the array of created span elements.
 *
 * @param {HTMLElement} el
 * @param {Object}   [options]
 * @param {String}   [options.wordClass='ds-inline-block'] – class to add to each word span
 * @param {String}   [options.containerClass] – class to add to the container (optional)
 * @returns {HTMLElement[]} Array of newly created span elements
 */
const splitElementText = (el, { wordClass = 'ds-inline-block', containerClass } = {}) => {
	if (!el) return [];
	if (containerClass) el.classList.add(containerClass);
	const frag = document.createDocumentFragment();
	const spans = [];

	el.childNodes.forEach(node => {
		if (node.nodeType === Node.TEXT_NODE) {
			node.textContent.split(/(\s+)/).forEach(part => {
				if (!part) return;
				if (/^\s+$/.test(part)) {
					frag.appendChild(document.createTextNode(part));
				} else {
					const span = document.createElement('span');
					span.classList.add(wordClass);
					span.textContent = part;
					frag.appendChild(span);
					spans.push(span);
				}
			});
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const tag = node.tagName.toLowerCase();
			if (tag === 'br') {
				frag.appendChild(node.cloneNode());
			} else if (tag === 'span') {
				const cloned = node.cloneNode(true);
				cloned.classList.add(wordClass);
				frag.appendChild(cloned);
				spans.push(cloned);
			} else {
				const wrapper = document.createElement('span');
				wrapper.classList.add(wordClass);
				wrapper.appendChild(node.cloneNode(true));
				frag.appendChild(wrapper);
				spans.push(wrapper);
			}
		}
	});

	el.innerHTML = '';
	el.appendChild(frag);
	return spans;
};

/**
 * Splits an element’s text into word spans and runs GSAP animation on them.
 *
 * @param {HTMLElement} el
 * @param {Object}   [options]
 * @param {Object}   [options.animProps={ yPercent: 120, stagger: 0.05 }]           – GSAP props
 * @param {Object}   [options.scrollTriggerOptions={ scrub: false, toggleActions: 'play none none reverse' }] – ScrollTrigger props
 * @param {String}   [options.wordClass='ds-inline-block']                         – class to add to each word span
 * @param {String}   [options.containerClass='no-scroll']                           – class to add to the container
 */
const splitAndAnimate = (
	el,
	{
		animProps = { yPercent: 120, stagger: 0.05 },
		wordClass = 'ds-inline-block',
		containerClass = 'no-scroll'
	} = {}
) => {
	const spans = splitElementText(el, { wordClass, containerClass });
	if (!spans.length) return;
	GSAPOnce(spans, animProps);
};

// Export functions if using modules
export { splitElementText, splitAndAnimate };
