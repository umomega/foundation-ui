<script>
export default {
	data() { return {
		editingLocale: (this.$route.params.locale != undefined ? this.$route.params.locale : this.$root.appLocale)
	}},
	created() {
		var self = this
		
		Event.$on('editing-locale-changed', function(locale) {
			self.changeEditingLocale(locale)
		})
	},
	computed: {
		canHaveMoreTranslations() {
			if(this.resource.locales == undefined) return false

			return this.$root.appLocales.filter(n => !this.resource.locales.includes(n)).length > 0
		},
		canDeleteCurrentTranslation() {
			return this.editingLocale != this.$root.appLocale
		}
	},
	methods: {
		openDeleteModal(payload) {
			Event.$emit('delete-modal-open', payload)
		},
		changeEditingLocale(locale) {
			router.push({ to: this.$route.name, params: { id: this.$route.params.id, locale: locale } })
			this.editingLocale = locale
		},
		clearError(field) {
			if(this.translatableFields != undefined && this.translatableFields.includes(field)) {
				this.form.errors.clear(field + '.' + this.editingLocale)
			} else {
				this.form.errors.clear(field)
			}
		}
	}
}
</script>