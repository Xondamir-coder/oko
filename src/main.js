// import './scss/main.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Modal from 'bootstrap/js/dist/modal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { register } from 'swiper/element/bundle';
import { splitAndAnimate, splitElementText } from './js/words';
import { GSAPOnce, GSAPScrub } from './js/gsap';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
register();

const lenis = new Lenis({ autoRaf: true });

const handleApartmentSelection = () => {
	const buttons = document.querySelector('.apartments__buttons');

	buttons.addEventListener('click', e => {
		const btn = e.target.closest('button.apartments__button');
		if (!btn) return;
		const lvl = btn.dataset.lvl;
		const svgGroup = document.querySelector(`.apartments__vector g[data-lvl="${lvl}"]`);
		document
			.querySelectorAll('.apartments__vector g')
			.forEach(g => g.classList.remove('active'));
		[...buttons.children].forEach(btn => btn.classList.remove('active'));
		if (!svgGroup) return;
		svgGroup.classList.add('active');
		btn.classList.add('active');
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
		document.body.classList.contains('no-scroll') ? lenis.stop() : lenis.start();
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
	const btn = document.querySelector('.plan__box button');
	btn.addEventListener('click', () => {
		btn.closest('[data-container]').classList.add('show-form');
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
		trigger: '.about__title',
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
			pin: true,
			pinSpacing: true
		}
	});
	GSAPScrub('.about__image', {
		animProps: {
			width: 0,
			stagger: 0.2
		},
		scrollTriggerOptions: aboutScrollTrigger
	});
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
	// 1) Define your four off-screen start positions (plus optional rotation)
	const DIRS = [
		{ x: -300, y: -200, rotation: 15 }, // ↖ from top-left
		{ x: -500, y: 200, rotation: -15 }, // ↗ from top-right
		{ x: 300, y: 400, rotation: 10 }, // ↙ from bottom-left
		{ x: 300, y: -200, rotation: -40 } // ↘ from bottom-right
	];

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
				start: 'top center'
				// end: '+=1000',
				// scrub: 1,
				// pin: true,
				// pinSpacing: true
			}
		});
		tl.to(section.querySelector('.section-label'), {
			yPercent: 0,
			top: 0,
			marginTop: 'clamp(15px, 1.1vw, 20px)',
			scale: 1.5
		});
		tl.to(section.querySelector('.section-label'), {
			xPercent: 0,
			left: 0,
			scale: 1,
			color: 'rgba(255, 255, 255, 0.6)',
			marginLeft: window.innerWidth > 768 ? 'min(1.7vw, 32px)' : 'clamp(15px, 1.1vw, 20px)'
		});
		tl.from(
			section.querySelector('.history__top'),
			{
				opacity: 0,
				y: 25
			},
			'-=0.75'
		);
		tl.to(
			section.querySelector('.section-label__container'),
			{
				background: '#FFFFFF1F'
			},
			'-=0.5'
		);

		tl.from(
			section.querySelectorAll('.history__card'),
			{
				x: i => DIRS[i % DIRS.length].x,
				y: i => DIRS[i % DIRS.length].y,
				rotation: i => DIRS[i % DIRS.length].rotation,
				opacity: 0,
				duration: 1.5,
				ease: 'power2.out',
				stagger: 0
			},
			0
		);
	});
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
				document.body.className === 'modal-open' ? lenis.stop() : lenis.start();
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
	GSAPOnce('.about__content', { x: -50 });

	gsap.utils.toArray('.gallery__top').forEach(el => {
		GSAPOnce(el.firstElementChild, { y: 25 });
		GSAPOnce(el.lastElementChild, { y: 25 });
	});

	const allCards = gsap.utils.toArray('.gallery__card');
	const allGalleries = gsap.utils.toArray('.gallery__list');
	const vals = Array.from({ length: allCards.length }, () => ({
		x: Math.floor(Math.random() * 200) - 100,
		y: Math.floor(Math.random() * 200) - 100,
		rotation: Math.floor(Math.random() * 30) - 15
	}));
	allGalleries.forEach((el, i) => {
		[...el.children].forEach((child, index) => {
			GSAPOnce(
				child,
				{
					y: vals[i].y,
					x: vals[i].x,
					rotation: vals[i].rotation,
					delay: index * 0.1
				},
				{
					trigger: el
				}
			);
		});
	});
	GSAPOnce('.apartments>*', {
		scale: 0.9,
		stagger: 0.1
	});
	GSAPOnce(
		'.cta .form>*',
		{
			y: 25,
			stagger: 0.2
		},
		{
			trigger: '.cta .form'
		}
	);
	GSAPOnce('.footer>*', {
		yPercent: 25,
		stagger: 0.15
	});
};
const handleSafari = () => {
	if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
		document.querySelector('.container').classList.add('safari');
	}
};
const handleHistoryModal = () => {
	const slider = document.querySelector('.history-modal__slider');
	const barElements = document.querySelectorAll('.history-modal__bar--inner');
	const timeline = gsap.timeline({
		repeat: -1
	});
	setInterval(() => {
		if (slider.swiper.activeIndex === slider.swiper.slides.length - 1) {
			slider.swiper.slideTo(0);
		} else {
			slider.swiper.slideNext();
		}
	}, 3000);
	barElements.forEach(bar => {
		timeline.to(bar, {
			scaleX: 1,
			duration: 3
		});
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

handleApartmentSelection();
setCopyrightYear();
handleMenu();
handleFormSubmission();
handlePlanModal();
handleVideoStart();
handleHeroAnimation();
handleAboutAnimation();
handleHistoryAnimations();
splitWordsAndAnimate();
handleLinkTextDuplications();
handleLinkClicks();
handleBody();
handleOtherAnimations();
handleSafari();
handleHistoryModal();
