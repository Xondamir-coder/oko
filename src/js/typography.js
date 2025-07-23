/**
 * Добавляет неразрывные пробелы после коротких русских предлогов
 * @param {string} html - Входной HTML
 * @returns {string} - HTML с заменёнными пробелами после предлогов
 */
export const fixRussianPrepositions = html => {
	const regex =
		/(?:^|[^а-яёА-ЯЁ0-9_])(в|без|а|до|из|к|я|на|по|о|от|перед|при|через|с|у|за|над|об|под|про|для|и|или|со|около|между)(?:\s)/g;

	return html.replace(regex, (match, p1) => {
		return match.replace(`${p1} `, `${p1}&nbsp;`);
	});
};
