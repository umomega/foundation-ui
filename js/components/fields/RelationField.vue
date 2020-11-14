<template>
	<div>
		<label class="label">{{ label }}</label>
		<div class="control">
			<div class="relation-field">
				<p class="pt-xs pb-xs pl-md pr-md" v-if="related.length == 0" v-text="trans.get('foundation::general.no_item_selected')"></p>
				<draggable v-if="!readonly" v-model="related" :tag="'ul'" @end="calculate" :animation="200">
					<li class="related-item" v-for="(item, i) in related" :key="item.id">{{ item.name }} <span class="delete is-small" @click="remove(i)"></span></li>
				</draggable>
				<ul v-if="readonly">
					<li class="related-item is-disabled" v-for="item in related" v-text="item.name"></li>
				</ul>
				<div class="field" v-if="!readonly">
					<div class="control has-icons-left">
						<input :ref="name + '_search'" type="text" :class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'" :placeholder="placeholder" @keydown. @keydown="search" v-model="searchTerm" @focus="isFocused = true" @blur="isFocused = true" @keydown.down.prevent="focusNavigator" @keydown.enter.prevent>
						<span class="icon is-small is-left">
							<i class="fas fa-search"></i>
						</span>
					</div>
					<div class="dropdown-menu relation-search" v-if="showsResults">
						<input class="sr-only" type="text" :ref="name + '_navigator'" @focus="isFocused = true" @blur="isFocused = true" @keydown.enter.prevent="addCurrentItem" @keydown.down.prevent="selectNextItem" @keydown.up.prevent="selectPreviousItem">
						<div class="dropdown-content">
							<a href="#" v-for="(item, i) in results" @click.prevent="add(item)" @mouseenter="selectedItem = i" v-text="item.name" :class="i == selectedItem ? 'dropdown-item is-active' : 'dropdown-item'"></a>
						</div>
					</div>
				</div>
			</div>
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
		<input type="hidden"
			:name="name"
			:value="calculatedValue"
			@change="$emit('input', $event.target.value)"
			>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import Field from '../../mixins/Field'
// https://github.com/SortableJS/Vue.Draggable
// https://sortablejs.github.io/Vue.Draggable/#/simple

export default {
	mixins: [ Field ],
	components: { draggable },
	data() {
		return {
			related: this.value || [],
			calculatedValue: '',
			searchTerm: '',
			timeoutHandle: null,
			isFocused: false,
			searchResults: [],
			selectedItem: null
		}
	},
	computed: {
		results() {
			var self = this;

			return self.searchResults.filter(function(result) {
				for(var i = 0; i < self.related.length; i++) {
					if(self.related[i].id == result.id) return false
				}

				return true;
			});
		},
		showsResults() {
			return this.results.length > 0 && (this.isFocused || this.isBrowsing);
		}
	},
	created() {
		this.calculate();
	},
	watch: {
		value(to, from) {
			this.related = to;
		}
	},
	methods: {
		calculate() {
			if(this.options.multiple) {
				this.calculatedValue = [];
				for(var i = 0; i < this.related.length; i++) {
					this.calculatedValue.push(this.related[i].id);
				}
			} else {
				this.calculatedValue = this.related[0].id
			}
		},
		remove(i) {
			this.related.splice(i, 1);
			this.calculate();
		},
		search() {
			clearTimeout(this.timeoutHandle)
			this.timeoutHandle = setTimeout(this.searchHandle, 200)
		},
		searchHandle() {
			var self = this;

			if(this.searchTerm.trim().length > 2) {

				axios.get(api_url_with_token(this.options.searchroute) + '&q=' + self.searchTerm)
					.then(function(response) {
						self.searchResults = response.data.data
					})
			}
		},
		add(item) {
			if(item == null) return;

			if(this.options.multiple) {
				this.related.push(item);
			} else {
				this.related = [item];
			}

			this.searchTerm = ''
			this.searchResults = []
			this.selectedItem = null
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
				this.add(this.searchResults[this.selectedItem])
			}
		}
	}
}
</script>