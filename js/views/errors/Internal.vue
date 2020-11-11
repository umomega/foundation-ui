<template>
	<div class="dialog-container is-transparent not-found-error">
		<div class="dialog is-transparent has-color-white has-text-centered">
			<h2 class="dialog-hero-heading">500</h2>
			<h1 v-text="trans.get('foundation::errors.internal')"></h1>
			<p class="mt-sm mb-sm" v-text="trans.get('foundation::errors.internal_description')"></p>
			<router-link :to="{ name: 'dashboard.overview' }" class="is-size-7 is-uppercase has-color-white has-text-weight-bold" exact v-text="trans.get('foundation::errors.go_to_dashboard')"></router-link>
		</div>
	</div>
</template>

<script>
import View from '../../mixins/View'

export default {
	mixins: [ View ],
	data() { return {
		titleLabel: 'foundation::errors.internal'
	}},
	created() {
		document.querySelector('html,body').classList.add('is-clipped');
	},
	destroyed() {
		document.querySelector('html,body').classList.remove('is-clipped');
	}
};
</script>