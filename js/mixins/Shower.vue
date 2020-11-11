<script>
import {assess_error} from '../helpers'

export default {
	data() { return {
		resource: {}
	}},
	created() {
		this.loadResource()
	},
	methods: {
		loadResource() {
			var self = this;

			axios.get(api_url_with_token(self.showRoute + '/' + router.currentRoute.params.id))
				.then(function(response) {
					if(self.form) self.form.populate(response.data)
					self.resource = response.data
					self.isLoaded = true
					Event.$emit('resource-loaded', response.data)
				})
				.catch(function(error) {
					assess_error(error)
				});
		}
	}
}
</script>