<template>
	<div :class="isLoaded ? 'reveal is-loaded' : 'reveal'">

		<Toolbar v-if="!hidestoolbar" :createroutename="createroutename" :searchterm="searchTerm" :route="route" :canwrite="canwrite" :createicon="createicon" :filterable="filterable">
			<div class="ml-md" v-if="!searchmode && filterable">
				<p class="is-size-9 has-text-weight-bold has-color-grey-light has-text-centered is-uppercase mb-xxs" v-text="trans.get('foundation::general.filter')"></p>
				<div class="select">
					<select @change="resetPageAndLoad" v-model="filterKey">
						<option value="all" v-text="trans.get('foundation::general.all')"></option>
						<option v-for="filter in filters" :value="filter.value" v-text="filter.label"></option>
					</select>
				</div>
			</div>

			<div class="ml-md" v-if="showBulkActions">
				<p class="is-size-9 has-text-weight-bold has-color-grey-light has-text-centered is-uppercase mb-xxs" v-text="trans.get('foundation::general.bulk_actions')"></p>
				<div class="field has-addons">
					<div class="control">
						<button class="button icon-only" @click="toggleCheckAll">
							<i :class="checkAllClass"></i>
						</button>
					</div>
					<div class="control" v-if="canwrite">
						<button class="button is-danger icon-only-wide" @click="confirmBulkDelete">
							<i class="icon fas fa-trash"></i>
						</button>
					</div>
				</div>
			</div>
		</Toolbar>

		<div class="paper has-flat-bottom">
			<div class="table-outer">
				<table class="table is-fullwidth is-hoverable datable">
					<thead>
						<tr>
							<th></th>
							<th v-for="sortable in sortables">
								<SortableLink v-if="!searchmode && !sortable.skip" :currentdir="sortDir" :currentkey="sortKey" :ownkey="sortable.key" :currentroute="route" :label="sortable.label"/>
								<span v-else="searchmode" class="has-color-grey">
									<span class="is-uppercase is-size-8" v-text="trans.get(sortable.label)"></span>
								</span>
							</th>

							<th v-for="header in headers">
								<span class="has-color-grey">
									<span class="is-uppercase is-size-8" v-text="trans.get(header)"></span>
								</span>
							</th>

							<slot name="table-head"></slot>
							<th class="datable-row-options"></th>
						</tr>
					</thead>
					<tbody>

						<tr v-if="content.data.length == 0">
							<td colspan="42"><p class="datable-no-results is-size-5 has-color-primary" v-text="trans.get('foundation::general.no_results_found')"></p></td>
						</tr>

						<tr v-for="row in content.data" class="datable-row">
							<th class="datable-row-head">
								<input v-if="!hidestoolbar" type="checkbox" :value="row.id" v-model="checked" @change="updateAllChecked">
								<slot name="table-row-thumb" v-bind:row="row"></slot>
							</th>
							<slot v-bind:row="row"></slot>
						</tr>

					</tbody>
				</table>
			</div>
		</div>

		<div class="datable-footer has-background-primary">
			<Pagination v-if="totalPages > 1 && !searchmode" :total="totalPages" :current="page" :sortkey="sortKey" :route="route" :sortdir="sortDir"/>
			
			<div class="has-text-centered pt-sm pb-sm" v-if="searchmode">
				<router-link class="has-color-white is-uppercase has-text-weight-bold is-size-7" :to="{ name: route }"><i class="icon fas fa-long-arrow-alt-left"></i> {{ trans.get(alllabel) }}</router-link>
			</div>
		</div>

	</div>
</template>

<script>
import SortableLink from '../snippets/SortableLink'
import DataLister from '../mixins/DataLister'
import Pagination from './Pagination'
import Toolbar from './Toolbar'

export default {
	props: ['defaultkey', 'defaultdir', 'route', 'sortables', 'headers', 'createroutename', 'createicon', 'indexloadroute', 'searchloadroute', 'bulkdeleteroute', 'alllabel', 'canwrite', 'hidestoolbar', 'filterable', 'filters'],
	mixins: [ DataLister ],
	components: { Toolbar, SortableLink, Pagination },
	watch: {
		$route(to, from) {
			this.searchTerm = to.query.q || ''
			Event.$emit('search-query-changed', this.searchTerm)

			this.page = (this.sortKey === to.query.s && this.sortDir === to.query.d && to.query.page) ? to.query.page : 1

			this.sortKey = to.query.s || this.defaultkey
			this.sortDir = to.query.d || this.defaultdir
			this.filterKey = to.query.f || 'all'

			this.load();
		}
	},
	data() {
		return {
			sortKey: this.$route.query.s || this.defaultkey,
			sortDir: this.$route.query.d || this.defaultdir,
			filterKey: this.$route.query.f || 'all',
			searchTerm: this.$route.query.q || '',
			page: this.$route.query.page || 1,
			content: { data: [] },
			checked: [],
			allChecked: false,
			isLoaded: false
		}
	},
	methods: {
		makeLoadRoute() {
			return (this.searchmode
				? api_url_with_token(this.searchloadroute) + '&q=' + this.searchTerm
				: api_url_with_token(this.indexloadroute) + '&s=' + this.sortKey + '&d=' + this.sortDir + '&page=' + this.page + (this.filterable ? '&f=' + this.filterKey : ''))
		},
		resetPageAndLoad() {
			router.push({name: this.route, query: {
				s: this.sortKey,
				d: this.sortDir,
				f: this.filterKey,
				page: 1
			}})
		},
	}
}
</script>