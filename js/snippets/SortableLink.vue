<template>
	<router-link :to="to" :class="currentkey == ownkey ? 'has-color-primary' : 'has-color-grey'"><span class="is-uppercase is-size-8">{{ trans.get(label) }} <i v-if="currentkey == ownkey" :class="sortIcon"></i></span></router-link>
</template>

<script>
export default {
	props: ['currentdir', 'currentkey', 'ownkey', 'currentroute', 'label'],
	computed: {
		to() {
			return {
				name: this.currentroute,
				query: {
					s: this.ownkey,
					d: this.ownkey == this.currentkey ? (this.currentdir == 'asc' ? 'desc' : 'asc') : 'asc'
				}
			}
		},
		sortIcon() {
			return 'icon fas fa fa-caret-' + (this.currentdir == 'asc' ? 'up' : 'down')
		}
	}
}
</script>