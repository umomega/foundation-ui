<script>
import {assess_error} from '../helpers'

export default {
	created() {
		this.load()

		var self = this

		Event.$off('resources-deleted')
		Event.$on('resources-deleted', function(data) {
			self.load()
		})
	},
	computed: {
		totalPages() {
			return Math.ceil(this.content.total/this.content.per_page)
		},
		showBulkActions() {
			return this.checked.length > 0
		},
		checkAllClass() {
			return 'icon fas fa-' + (this.allChecked ? 'check-square' : 'minus-square')
		},
		searchmode() {
			return this.searchTerm.length > 0 && this.searchloadroute
		}
	},
	methods: {
		load() {
			var self = this;
			this.checked = [];

			axios.get(this.makeLoadRoute())
				.then(function(response) {
					self.content = response.data;
					self.isLoaded = true
				})
				.catch(function(error) { assess_error(error) })
		},
		toggleCheckAll() {
			this.allChecked = !this.allChecked
			this.checked = []

			if(!this.allChecked) return

			for(let row in this.content.data)
			{
				this.checked.push(this.content.data[row].id)
			}
		},
		updateAllChecked() {
			if(this.checked.length == this.content.data.length) {
				this.allChecked = true
			} else {
				this.allChecked = false
			}
		},
		confirmBulkDelete() {
			Event.$emit('delete-modal-open', { bulk: true, items: this.checked, route: this.bulkdeleteroute });
		}
	}
}
</script>