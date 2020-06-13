<template>
	<div class="paper__footer">
		<div class="field has-addons is-pulled-right">
			<slot></slot>
			<div class="control">
				<button class="button icon-only-wide is-primary" type="submit" :disabled="form.errors.anyErrors">
					<i :class="icon"></i>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['config', 'value'],
		data() {
			return {
				form: this.value || {}
			}
		},
		computed: {
			icon() {
				return 'icon fas fa-' + this.config.icon;
			}
		}
	}
</script>