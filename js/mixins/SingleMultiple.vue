<script>
import draggable from 'vuedraggable'
import Field from './Field'

export default {
	mixins: [Field],
	components: {draggable},
	data() { return {
		selected: this.value
	}},
	watch: {
		value(to) {
			this.selected = this.value
		}
	},
	methods: {
		remove(i) {
			this.selected.splice(i, 1)
			this.updateValue()
		},
		updateValue() {
			this.$emit('input', this.selected)
		}
	}
}
</script>