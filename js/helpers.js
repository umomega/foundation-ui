function api_url(url) {
	return '/api/' + url;
}

function api_url_with_token(url) {
	return api_url(url + '?api_token=' + window.token);
}

import moment from 'moment';
moment.locale(window.locale);

function format_date(date, format = 'MMM D, YYYY') {
	return moment(date).format(format);
}

function format_date_for_humans(date) {
	return moment(date).fromNow();
}

function assess_error(error) {
	if(error.response == undefined) return
	
	const status = error.response.status;

	if(status == 404) {
		router.push({ name: 'errors.notfound' });
	} else if(status == 403 || error.response.status == 401) {
		router.push({ name: 'errors.unauthorized' });
	} else if(status == 500) {
		router.push({ name: 'errors.internal' });
	}
}

function readable_file_size(size) {
	var i = -1;
	var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
	do {
		size = size / 1024;
		i++;
	} while (size > 1024);

	return Math.max(size, 0.1).toFixed(1) + byteUnits[i];
}

export {
	api_url,
	api_url_with_token,
	format_date,
	format_date_for_humans,
	assess_error,
	readable_file_size
}