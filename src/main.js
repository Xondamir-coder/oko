import './scss/main.scss';

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

handleApartmentSelection();
