import './scss/main.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Modal from 'bootstrap/js/dist/modal';
import { register } from 'swiper/element/bundle';

register();

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

	btn.addEventListener('click', () => {
		console.log('hello');
		document.body.classList.toggle('no-scroll');
		container.classList.toggle('active');
		menu.classList.toggle('active');
		btn.classList.toggle('active');
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

			if (!e.target.closest('.popup')) {
				modal.show();
			}

			const popupContainer = document.querySelector('.popup__container');
			popupContainer.classList.add('active');
			setTimeout(() => {
				popupContainer.classList.remove('active');
				form.reset();
			}, 3000);
		});

		const telInput = form.querySelector('input[name="tel"]');
		telInput.addEventListener('input', () => {
			telInput.value = telInput.value.replace(/[^\d +]/g, '');
		});
	});
};

handleApartmentSelection();
setCopyrightYear();
handleMenu();
handleFormSubmission();
