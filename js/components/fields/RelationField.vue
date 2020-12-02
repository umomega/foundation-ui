<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<div :class="options.wrapper ? options.wrapper : 'relation-field'">
				<slot name="message" :related="selected">
					<p class="pt-xs pb-xs pl-md pr-md" v-if="!selected || (selected && selected.length == 0)" v-text="trans.get('foundation::general.no_item_selected')"></p>
				</slot>
				
				<draggable v-if="!readonly" v-model="selected" :tag="options.tag ? options.tag : 'ul'" @end="updateValue" :animation="200" :class="options.class ? options.class : ''">
					<slot name="draggable" :related="selected" :remove="remove">
						<li class="related-item" v-for="(item, i) in selected" :key="item.id">{{ getItemName(item) }} <span class="delete is-small" @click="remove(i)"></span></li>
					</slot>
				</draggable>

				<slot name="readonly" :readonly="readonly" :related="selected" :translated="translated">
					<ul v-if="readonly">
						<li class="related-item is-disabled" v-for="item in selected" v-text="getItemName(item)"></li>
					</ul>
				</slot>

				<div class="field" v-if="!readonly">
					<div class="control has-icons-left">
						<input :ref="name + '_search'" type="text" :class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'" :placeholder="placeholder" @keydown="search" v-model="searchTerm" @focus="isFocused = true" @blur="isFocused = true" @keydown.down.prevent="focusNavigator" @keydown.enter.prevent>
						<span class="icon is-small is-left">
							<i class="fas fa-search"></i>
						</span>
					</div>
					<div class="dropdown-menu relation-search" v-if="showsResults">
						<input class="sr-only" type="text" :ref="name + '_navigator'" @focus="isFocused = true" @blur="isFocused = true" @keydown.enter.prevent="addCurrentItem" @keydown.down.prevent="selectNextItem" @keydown.up.prevent="selectPreviousItem">
						<div class="dropdown-content">
							<a href="#" v-for="(item, i) in results" @click.prevent="add(item)" @mouseenter="selectedItem = i" v-text="getItemName(item)" :class="i == selectedItem ? 'dropdown-item is-active' : 'dropdown-item'"></a>
						</div>
					</div>
				</div>
			</div>
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>

<script>
import SingleMultiple from '../../mixins/SingleMultiple'
// https://github.com/SortableJS/Vue.Draggable
// https://sortablejs.github.io/Vue.Draggable/#/simple

export default {
	mixins: [ SingleMultiple ],
	data() {
		return {
			searchTerm: '',
			timeoutHandle: null,
			isFocused: false,
			searchResults: [],
			selectedItem: null
		}
	},
	computed: {
		results() {
			var self = this

			return self.searchResults.filter(function(result) {
				if(self.options.multiple) {
					const l = (self.selected != null && Array.isArray(self.selected)) ? self.selected.length : 0

					for(var i = 0; i < l; i++) {
						if(self.selected[i].id == result.id) return false
					}
				} else {
					return result.id != (self.selected != null ? self.selected.id : 0)
				}

				return true
			})
		},
		showsResults() {
			return this.results.length > 0 && (this.isFocused || this.isBrowsing)
		},
		translated() {
			return this.options.translated
		}
	},
	created() {
		this.updateValue()
	},
	methods: {
		search() {
			clearTimeout(this.timeoutHandle)
			this.timeoutHandle = setTimeout(this.searchHandle, 200)
		},
		searchHandle() {
			var self = this

			if(this.searchTerm.trim().length > 2) {
				var route = api_url_with_token(this.options.searchroute) + '&q=' + self.searchTerm

				if(self.options.filter) {
					route = route + '&of=' + (Array.isArray(self.options.filter) ? encodeURI(self.options.filter.join(',')) : encodeURI(self.options.filter))
				}

				axios.get(route)
					.then(function(response) {
						self.searchResults = response.data.data
					})
			}
		},
		add(item) {
			if(item == null) return

			if(this.options.multiple) {
				this.selected.push(item)
			} else {
				this.selected = [item]
			}

			this.searchTerm = ''
			this.searchResults = []
			this.selectedItem = null

			this.updateValue()
		},
		focusNavigator() {
			if(this.searchResults.length > 0) {
				this.$refs[this.name + '_navigator'].focus()
				this.selectedItem = 0
			}
		},
		selectNextItem() {
			if(this.selectedItem == null) {
				this.selectedItem = 0
			} else if(this.selectedItem + 1 < this.searchResults.length) {
				this.selectedItem = this.selectedItem + 1
			}
		},
		selectPreviousItem() {
			if(this.selectedItem == 0) {
				this.selectedItem = null
				this.$refs[this.name + '_search'].focus()
			} else if(this.selectedItem != null) {
				this.selectedItem = this.selectedItem - 1
			}
		},
		addCurrentItem() {
			if(this.selectedItem != null) {
				this.add(this.results[this.selectedItem])
			}
		},
		getItemName(item) {
			const namekey = this.options.namekey ? this.options.namekey : 'name'
			return this.translated ? item[namekey][this.$root.appLocale] : item[namekey]
		}
	}
}
</script>