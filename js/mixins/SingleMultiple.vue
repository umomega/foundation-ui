<script>
import draggable from 'vuedraggable'
import Field from './Field'

export default {
	mixins: [Field],
	components: {draggable},
	data() { return {
		selected: this.compileValue() || []
	}},
	watch: {
		value(to) {
			this.selected = this.compileValue()
		}
	},
	methods: {
		remove(i) {
			this.selected.splice(i, 1)
			this.updateValue()
		},
		updateValue() {
			this.$emit('input', this.selected)
		},
		compileValue() {
			if(this.options.multiple) {
				return ((this.value == '' || this.value == null || this.value.length == 0) ? [] : this.value)
			}

			return ((this.value == '' || this.value == null || this.value.length == 0) ? null : this.value)
		}
	}
}
</script>