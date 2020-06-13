<script>
import { loadProgressBar } from 'axios-progress-bar'

export default {
	title: (context) => `${context.pagetitle}`,
	computed: {
		pagetitle() {
			return this.$root.trans.get(this.titleLabel);
		}
	},
	data() {
		return {
			isLoaded: false
		}
	},
	created() {
		loadProgressBar()

		Event.$emit('page-changed', {title: this.pagetitle || '', breadcrumbs: this.breadcrumbs || [] })
	}
};
</script>