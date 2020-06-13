<script>
import {assess_error} from '../helpers';

export default {
	methods: {
		requestUpdate(route) {
			const self = this;

			self.form.put(api_url(route + '/' + router.currentRoute.params.id))
				.then(function(data) { 
					self.resource = data.payload
					self.form.populate(data.payload)
					self.notifier.success(data.message)
				})
				.catch(function(error) {
					self.notifier.danger(self.trans.get('foundation::general.errors_saving'))

					assess_error(error)
				})
		}
	}
}
</script>