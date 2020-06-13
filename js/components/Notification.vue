<template>
	<div :class="notificationClass" role="alert">
		<button class="delete" @click="notification.close"></button>
		<p class="is-size-7"><i :class="iconClass"></i>{{ notification.item.text }}</p>
	</div>
</template>

<script>
export default {
	props: ['notification'],
	computed: {
		notificationClass() {
			return 'notification is-' + this.notification.item.type;
		},
		iconClass() {
			var icon = 'exclamation';

			if (this.notification.item.type == 'success') {
				icon = 'check';
			} else if(this.notification.item.type == 'danger') {
				icon = 'times';
			}

			return 'mr-xs fas fa-' + icon;
		}
	}
}
</script>
