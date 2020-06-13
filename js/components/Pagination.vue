<template>
	<div :class="inverted == undefined || inverted ? 'pagination is-inverted' : 'pagination'">
		<router-link :to="routeFor(1)" :class="current == 1 ? 'is-disabled' : ''">
			<i class="icon fas fa-angle-double-left"></i>
		</router-link>
		<router-link :to="routeFor(current - 1)" :class="current == 1 ? 'is-disabled' : ''">
			<i class="icon fas fa-chevron-left"></i>
		</router-link>

		<div class="pagination-pages">
			<span class="is-uppercase">{{ trans.get('foundation::general.page_ct', {current: current, total: total}) }}<i class="icon fas fa-chevron-down"></i></span>

			<select class="pagination-select" @change="changePage" v-model="currentPage">
				<option v-for="n in total" :value="n" v-text="n"></option>
			</select>
		</div>

		<router-link :to="routeFor(current + 1)" :class="current == total ? 'is-disabled' : ''">
			<i class="icon fas fa-chevron-right"></i>
		</router-link>
		<router-link :to="routeFor(total)" :class="current == total ? 'is-disabled' : ''">
			<i class="icon fas fa-angle-double-right"></i>
		</router-link>
	</div>
</template>

<script>
export default {
	props: ['total', 'current', 'sortkey', 'sortdir', 'filterkey', 'route', 'inverted'],
	data() {
		return {
			currentPage: this.current
		}
	},
	methods: {
		routeFor(page) {
			if(page < 1) { page = 1 } else if(page > this.total) { page = this.total }

			var query = {
				s: this.sortkey,
				d: this.sortdir,
				page: page
			}

			if(this.filterkey != undefined) {
				query['f'] = this.filterkey
			}

			return {
				name: this.route,
				query: query
			}
		},
		changePage() {
			router.push(this.routeFor(this.currentPage));
		}
	}
}
</script>