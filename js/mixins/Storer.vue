<script>
import {assess_error} from '../helpers'

export default {
	methods: {
		requestStore(route, redirect, parent = null) {
			var self = this;

			self.form.post(api_url(route))
				.then(function(data) { 
					self.notifier.success(data.message)

					var params = {id: data.payload.id}

					if(parent) params['parent'] = parent
					
					if(data.action != undefined) {
						params[data.action[0]] = data.action[1]
					}

					router.push({ name: redirect, params: params })
				})
				.catch(function(error) {
					self.notifier.danger(self.trans.get('foundation::general.errors_saving'))

					assess_error(error)
				})
		}
	},
	mounted() {
		const self = this;
		setTimeout(function() {
			self.isLoaded = true
		}, 1);
	}
}
</script>