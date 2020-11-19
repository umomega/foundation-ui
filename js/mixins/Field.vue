<script>
export default {
	props: {
		readonly: {type: Boolean|undefined, required: true},
		placeholder: {type: String, default: ''},
		label: {type: String|undefined, required: true},
		name: {type: String, required: true},
		value: {type: String|Array, default: ''},
		errors: {type: Object, default: {}},
		options: {type: Object, default: {}},
		locale: {type: String, default: ''},
		translatable: {type: Boolean, default: false},
		hint: {type: String|undefined, default: ''}
	},
	methods: {
		anyErrors() {
			return this.errors.has(this.translatable ? this.name + '.' + this.locale : this.name)
		},
		getErrorMessage() {
			return this.errors.get(this.translatable ? this.name + '.' + this.locale : this.name)
		}
	}
}
</script>