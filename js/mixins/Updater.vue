<script>
import {assess_error} from '../helpers'

export default {
	methods: {
		requestUpdate(route, flag = '', id = null) {
			const self = this;

			self.form.put(api_url(route + '/' + (id ? id : router.currentRoute.params.id) + flag))
				.then(function(data) { 
					self.resource = data.payload
					self.form.populate(data.payload)
					self.notifier.success(data.message)

					if(data.event) Event.$emit(data.event, data.payload)
				})
				.catch(function(error) {
					const message = error.hasOwnProperty('errors') ?
						self.trans.get('foundation::general.errors_saving') :
						error.message

					self.notifier.danger(message)

					assess_error(error)
				})
		}
	}
}
</script>