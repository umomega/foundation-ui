<template>
	<div class="toolbar level is-mobile">
		<div class="level-left">
			<div>
				<p class="is-size-9 has-text-weight-bold has-color-grey-light has-text-centered is-uppercase mb-xxs" v-text="trans.get('foundation::general.search')"></p>
				<div class="search-tool field">
					<div class="control has-icons-left">
						<input name="q" type="search" :placeholder="trans.get('foundation::general.search_for')" class="input" @keydown.enter="search" v-model="searchTerm" autocomplete="off">
						<span class="icon is-small is-left">
							<i class="fas fa-search"></i>
						</span>
					</div>
				</div>
			</div>

			<slot></slot>

		</div>

		<div class="level-right pl-md" v-if="canwrite">
			<div>
				<slot name="toolbar-buttons">
					<p v-if="createroutename" class="is-size-9 has-text-weight-bold has-color-grey-light has-text-centered is-uppercase mb-xxs" v-text="trans.get('foundation::general.create')"></p>
					<router-link v-if="createroutename" :to="{ name: createroutename }" class="button icon-only-wide is-primary"><i :class="createIcon"></i></router-link>
				</slot>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	props: ['createroutename', 'createicon', 'searchquery', 'route', 'canwrite'],
	computed: {
		createIcon() {
			return 'icon fas fa-' + (this.createicon ? this.createicon : 'plus')
		}
	},
	data() {
		return {
			searchTerm: ''
		}
	},
	methods: {
		search() {
			if(this.searchTerm.trim().length > 0) {
				router.push({ query: {q: this.searchTerm} });
			}
		}
	},
	created() {
		const self = this
		
		self.searchTerm = self.searchquery || '' 

		Event.$on('search-query-changed', function(query) {
			self.searchTerm = query
		})
	}
}
</script>