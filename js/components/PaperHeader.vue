<template>
	<div class="paper-header has-background-primary">
		<div class="level is-mobile">
			<div class="level-left pl-md">
				<a href="#" v-if="editingLocale != null" v-for="locale in resource.locales" :class="(locale == editingLocale ? 'pill is-active is-uppercase' : 'pill is-uppercase') + (errors.erroredLocales.includes(locale) ? ' is-danger' : '')" v-text="locale" @click.prevent="changeEditingLocale(locale)"></a>
			</div>
			
			<div class="level-right" v-if="permission">
				<div class="dropdown is-hoverable is-right is-pulled-right">
					<div class="dropdown-trigger">
						<button class="pill is-active" aria-haspopup="true">
							<span class="icon"><i class="fas fa-ellipsis-v"></i></span>
						</button>
					</div>
					<div class="dropdown-menu" role="menu">
						<div class="dropdown-content">
							<div class="dropdown-label" v-text="trans.get('foundation::general.options')"></div>
							<slot></slot>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
export default {
	props: ['permission', 'resource', 'editingLocale', 'errors'],
	methods: {
		changeEditingLocale(locale) {
			Event.$emit('editing-locale-changed', locale)
		}
	},
	created() {
		var self = this
		
		Event.$off('resources-deleted')
		Event.$on('resources-deleted', function(data) {
			if(data.redirect != undefined && data.redirect != self.$route.name) {
				router.push({ name: data.redirect })
			} else if(data.fallback != undefined) {
				self.loadResource()
				router.push(data.fallback)
				self.changeEditingLocale(self.$root.appLocale)
			}
		})
	}
}
</script>