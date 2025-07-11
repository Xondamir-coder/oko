import Lenis from 'lenis';
import imagesLoaded from 'imagesloaded';
import Modal from 'bootstrap/js/dist/modal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { register } from 'swiper/element/bundle';
import { splitAndAnimate } from './js/words';
import { GSAPOnce, GSAPScrub } from './js/gsap';

gsap.registerPlugin(ScrollTrigger);
register();

const lenis = new Lenis({ autoRaf: true, lerp: 0.15 });

const handleApartmentSelection = () => {
	const apartments = document.querySelectorAll('.apartments');
	apartments.forEach(apartment => {
		const buttons = apartment.querySelector('.apartments__buttons');
		const vectors = apartment.querySelector('.apartments__vector');
		const bsModal = Modal.getOrCreateInstance('#plan-modal');
		buttons.addEventListener('click', e => {
			const btn = e.target.closest('button.apartments__button');
			if (!btn) return;
			const lvl = btn.dataset.lvl;
			const svgGroup = apartment.querySelector(`.apartments__vector g[data-lvl="${lvl}"]`);
			apartment
				.querySelectorAll('.apartments__vector g')
				.forEach(g => g.classList.remove('active'));
			[...buttons.children].forEach(btn => btn.classList.remove('active'));
			if (!svgGroup) return;
			svgGroup.classList.add('active');
			btn.classList.add('active');
		});
		vectors.addEventListener('click', e => {
			const vector = e.target.closest('.apartments__vector-group');
			if (!vector) return;
			bsModal.show();
		});
	});
};
const setCopyrightYear = () => {
	const year = new Date().getFullYear();
	const el = document.querySelector('.footer__year');
	el.textContent = el.textContent.replace('{year}', year);
};
const handleMenu = () => {
	const btn = document.querySelector('.header__action--menu');
	const container = document.querySelector('.container__top');
	const menu = document.querySelector('.menu');

	const handleToggles = () => {
		document.body.classList.toggle('no-scroll');
		container.classList.toggle('active');
		menu.classList.toggle('active');
		btn.classList.toggle('active');
	};
	btn.addEventListener('click', handleToggles);
	menu.addEventListener('click', e => {
		if (e.target.closest('a')) handleToggles();
	});
};
const handleFormSubmission = () => {
	const forms = document.querySelectorAll('form');
	const myModalEl = document.getElementById('form-modal');
	const modal = Modal.getOrCreateInstance(myModalEl);

	forms.forEach(form => {
		form.addEventListener('submit', e => {
			e.preventDefault();
			const formData = new FormData(form);

			// console.log(...formData);

			if (!e.target.closest('[data-container]')) {
				modal.show();
			}

			const popupContainer = e.target.closest('[data-container]');
			popupContainer.classList.add('active');
			setTimeout(() => {
				popupContainer.classList.remove('active', 'show-form');
				form.reset();
			}, 3000);
		});

		const telInput = form.querySelector('input[name="tel"]');
		telInput.addEventListener('input', () => {
			telInput.value = telInput.value.replace(/[^\d +]/g, '');
		});
	});
};
const handlePlanModal = () => {
	const btn = document.querySelector('.plan__box button.plan--desktop');
	btn.addEventListener('click', () => {
		btn.closest('[data-container]').classList.add('show-form');
	});
	const planModalEl = document.getElementById('plan-modal');
	planModalEl.addEventListener('show.bs.modal', () => {
		document.querySelector('.plan__container').className = 'plan__container';
	});
};
const splitWordsAndAnimate = () => {
	document.querySelectorAll('section h2').forEach(title => {
		splitAndAnimate(title, {
			animProps: { yPercent: 120, stagger: 0.05 }
		});
	});
};
const handleAboutAnimation = () => {
	const aboutScrollTrigger = {
		trigger: '.about',
		start: 'center center',
		end: '+=1000'
	};
	GSAPScrub('.about__title>*:not(.about__image)', {
		animProps: {
			opacity: 0.4,
			stagger: 0.1
		},
		scrollTriggerOptions: {
			...aboutScrollTrigger,
			pin: '.about',
			pinSpacing: true
			// pin: true,
		}
	});
	GSAPScrub('.about__image', {
		animProps: {
			width: 0,
			stagger: 0.2
		},
		scrollTriggerOptions: aboutScrollTrigger
	});
	GSAPOnce('.about__content', { y: 25 });
};
const handleVideoStart = () => {
	document.querySelectorAll('.section-card').forEach(el => {
		el.addEventListener('mouseenter', () => {
			el.classList.add('playing');
			const videoEl = el.querySelector('video');
			if (!videoEl) return;
			videoEl.play();
		});
	});
};
const handleHistoryAnimations = () => {
	const sections = gsap.utils.toArray('.history');

	if (window.innerWidth > 900) {
		// 1) Define your four off-screen start positions (plus optional rotation)
		const getDIRS = () => {
			const w = window.innerWidth;
			return [
				{ x: -0.2 * w, y: -0.15 * w, rotation: 15 }, // ↖ from top-left
				{ x: -0.35 * w, y: 0.15 * w, rotation: -15 }, // ↗ from top-right
				{ x: 0.2 * w, y: 0.3 * w, rotation: 10 }, // ↙ from bottom-left
				{ x: 0.2 * w, y: -0.15 * w, rotation: -40 } // ↘ from bottom-right
			];
		};
		const DIRS = getDIRS();

		const scrollTriggerObj = {
			start: 'center center',
			end: '+=1000',
			scrub: 1,
			pin: true,
			pinSpacing: true
		};

		sections.forEach(section => {
			const label = section.querySelector('.section-label');

			gsap.set(label, {
				xPercent: -50,
				yPercent: -50,
				scale: 2,
				color: '#fff'
			});
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					...scrollTriggerObj
				}
			});
			tl.to(section.querySelector('.section-label'), {
				yPercent: 0,
				top: 0,
				marginTop: 'clamp(15px, 2.8vw, 52px)',
				scale: 1.5
			});
			tl.to(section.querySelector('.section-label'), {
				xPercent: 0,
				left: 0,
				scale: 1,
				color: 'rgba(255, 255, 255, 0.6)',
				marginLeft: 'clamp(15px, 2.8vw, 52px)'
			});
			tl.from(
				section.querySelector('.history__top'),
				{
					opacity: 0,
					y: 25
				},
				// '-=0.75'
				'-=0.5'
			);
			// tl.to(
			// 	section.querySelector('.section-label__container'),
			// 	{
			// 		background: '#FFFFFF1F'
			// 	},
			// 	'-=0.5'
			// );

			tl.from(
				section.querySelectorAll('.history__card'),
				{
					x: i => DIRS[i % DIRS.length].x,
					y: i => DIRS[i % DIRS.length].y,
					rotation: i => DIRS[i % DIRS.length].rotation,
					duration: 1.5,
					ease: 'power2.out',
					stagger: 0
				},
				0
			);
		});
	} else {
		sections.forEach(section => {
			const label = section.querySelector('.section-label');
			const content = section.querySelector('.history__top');
			GSAPOnce(label, { x: -25 });
			GSAPOnce(content, { x: -25 });
			GSAPOnce(section.querySelectorAll('.history__card'), { y: 100, stagger: 0.1 });
		});
	}
};
const handleLinkTextDuplications = () => {
	const links = document.querySelectorAll('a[href*="/"]:not(.button), a[href*="#"]:not(.button)');
	links.forEach(link => {
		if (!link.innerHTML.trim().includes('<')) {
			link.innerHTML = `
				<span class="link-span">${link.textContent.trim()}</span>
				<span class="link-span">${link.textContent.trim()}</span>
			`;
		}
	});
};
const handleLinkClicks = () => {
	const links = document.querySelectorAll('a[href*="#"]');
	links.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const href = link.getAttribute('href');
			lenis.scrollTo(href, {
				offset: -25
			});
		});
	});
};
const handleBody = () => {
	// 1. Create your observer callback
	const onBodyClassChange = mutationsList => {
		for (let mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				document.body.classList.contains('modal-open') ||
				document.body.classList.contains('no-scroll')
					? lenis.stop()
					: lenis.start();
			}
		}
	};

	// 2. Instantiate the observer
	const observer = new MutationObserver(onBodyClassChange);

	// 3. Start observing <body> for class changes
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ['class']
	});

	// 4. (Optional) Later, to stop observing:
	// observer.disconnect();
};
const handleOtherAnimations = () => {
	gsap.utils.toArray('.gallery__top').forEach(el => {
		GSAPOnce(el.firstElementChild, { y: 25 });
		GSAPOnce(el.lastElementChild, { y: 25 });
	});

	const allGalleries = gsap.utils.toArray('.gallery__list');
	allGalleries.forEach((el, i) => {
		GSAPOnce(el.children, {
			stagger: 0.1,
			y: 100
		});
	});
	GSAPOnce('.container .apartments>*', {
		scale: 0.9,
		stagger: 0.1
	});
	GSAPOnce('.cta>*', {
		y: 25,
		stagger: 0.2
	});
	GSAPOnce('.footer>*:not(.logo-link)', {
		yPercent: 25,
		stagger: 0.15
	});
	GSAPOnce('.slider__bottom', {
		y: 50
	});
};
const handleSafari = () => {
	if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
		document.querySelector('.container').classList.add('safari');
	}
};
const handleHistoryModal = () => {
	const sliderEl = document.querySelector('.history-modal__slider');
	const bars = document.querySelectorAll('.history-modal__bar--inner');
	const swiper = sliderEl.swiper;

	const updateBars = activeIndex => {
		bars.forEach((bar, i) => {
			const isBefore = i < activeIndex;
			const isCurrent = i === activeIndex;

			// animate filled / empty
			gsap.to(bar, {
				scaleX: isBefore ? 1 : 0,
				duration: 0.5,
				ease: 'power2.out'
			});

			// set a class on the current bar for custom styling
			bar.classList.toggle('current', isCurrent);
		});
	};

	// initial paint
	updateBars(swiper.activeIndex);

	swiper.on('slideChange', () => {
		updateBars(swiper.activeIndex);
	});
};
const handleHeroAnimation = () => {
	// Hero animation is full CSS here we only toggle body overflow
	document.body.classList.add('no-scroll');
	lenis.stop();
	setTimeout(() => {
		document.body.classList.remove('no-scroll');
		lenis.start();
	}, 3000);
};
const handleParallax = () => {
	gsap.from('.hero__towers img', {
		yPercent: 10,
		ease: 'none',
		scrollTrigger: {
			scrub: 1,
			trigger: '.hero__towers',
			start: 'top 80%',
			end: 'bottom center'
		}
	});
};
const handleButtons = () => {
	const buttons = document.querySelectorAll('.button, .section-card__button');
	buttons.forEach(button => {
		const svgIcon = button.querySelector('.icon');
		if (!svgIcon) return;
		button.removeChild(svgIcon);

		const box = document.createElement('div');
		box.classList.add('button__box');
		box.appendChild(svgIcon);
		box.appendChild(svgIcon.cloneNode(true));

		button.appendChild(box);
	});
};
const handleDownScroll = () => {
	const btn = document.querySelector('.hero__down');
	btn.addEventListener('click', () => {
		lenis.scrollTo('#about-title', {
			offset: -100
		});
	});
};
const handlePointer = () => {
	if (window.innerWidth < 900) return;
	const containers = document.querySelectorAll('.section-card[data-bs-target="#history-modal"]');
	const pointer = document.querySelector('.pointer');
	if (!containers || !pointer) return;

	const onMouseMove = e => {
		const x = e.clientX;
		const y = e.clientY;
		gsap.to(pointer, { x, y, duration: 0.25 });
	};
	containers.forEach(container => {
		container.addEventListener('mouseenter', () => {
			container.style.cursor = 'none';
			gsap.to(pointer, { scale: 1 });
			document.addEventListener('mousemove', onMouseMove);
		});

		container.addEventListener('mouseleave', () => {
			container.style.cursor = '';
			document.removeEventListener('mousemove', onMouseMove);
			gsap.to(pointer, { scale: 0 });
		});
	});
};

// Functions
handleSafari();
setCopyrightYear();
handleLinkTextDuplications();
handleApartmentSelection();
handleMenu();
handleBody();
handleFormSubmission();
handlePlanModal();
handleButtons();
handleVideoStart();
handleDownScroll();
handlePointer();
handleLinkClicks();
handleHistoryModal();

// Animations related
document.addEventListener('DOMContentLoaded', () => {
	handleHeroAnimation();
	handleAboutAnimation();
	handleHistoryAnimations();
	splitWordsAndAnimate();
	handleOtherAnimations();
	handleParallax();
});

// Once images are loaded refresh ScrollTrigger
imagesLoaded(document.body, () => {
	requestAnimationFrame(() => {
		ScrollTrigger.refresh();
		console.log('ScrollTrigger refreshed after paint');
	});
});
