<template>
	<div :class="activeClass">
		<div class="modal-background" @click="close"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title has-color-danger" v-text="trans.get('foundation::general.danger')"></p>
				<button class="delete is-large" aria-label="close" @click="close"></button>
			</header>
			<section class="modal-card-body" v-text="trans.get('foundation::general.confirm_delete')"></section>
			<footer class="modal-card-foot">
				<button class="button is-black is-uppercase" v-text="trans.get('foundation::general.cancel')" @click="close"></button>
				<button class="button is-danger is-uppercase" @click="requestDelete">
					<span class="icon-flap"><span class="icon fas fa-trash"></span></span>
					<span>{{ trans.get('foundation::general.delete') }}</span>
				</button>
			</footer>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			payload: {},
			isOpen: false
		}
	},
	computed: {
		activeClass() {
			return this.isOpen ? 'modal is-active' : 'modal'
		}
	},
	mounted() {
		const self = this;
		
		Event.$on('delete-modal-open', function(payload) {
			document.querySelector('html,body').classList.add('is-clipped')
			self.payload = payload
			self.isOpen = true
		});

		Event.$on('delete-modal-close', function() {
			document.querySelector('html,body').classList.remove('is-clipped')
			self.payload = {}
			self.isOpen = false
		})
	},
	methods: {
		close() {
			Event.$emit('delete-modal-close');
		},
		requestDelete() {
			var data = {}
			var self = this

			if (this.payload.bulk) {
				data['items'] = this.payload.items;
			}
			
			axios.delete(api_url(this.payload.route), { data: data })
				.then(function(response) {
					self.notifier.success(response.data.message);
					Event.$emit('resources-deleted', response.data);
				})
				.catch(function(error) {self.notifier.danger(self.trans.get('foundation::general.errors_deleting'))})

			this.close()
		}
	}
}
</script>