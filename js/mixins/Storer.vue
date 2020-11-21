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

					if(data.event) Event.$emit(data.event, data.payload)

					router.push({ name: redirect, params: params })
				})
				.catch(function(error) {
					const message = error.hasOwnProperty('errors') ?
						self.trans.get('foundation::general.errors_saving') :
						error.message

					self.notifier.danger(message)

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