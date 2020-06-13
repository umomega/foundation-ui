import axios from 'axios';
import {api_url_with_token} from './helpers';

// Shared Store
var store = {
	user: {
		'first_name': '',
		'last_name': '',
		'email': '',
		'full_name': '',
		'initials': '',
		'gravatar': '',
		'all_permissions': window.permissions
	}
};

window.Fetcher = {
	fetchUser() {
		return axios.get(api_url_with_token('profile/info'))
		.then(function(response) {
			store.user = response.data
		});
	}
}

// Evoke Fetchers
Fetcher.fetchUser();

export default store;