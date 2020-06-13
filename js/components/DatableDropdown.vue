<template>
	<td class="datable-row-options">
		<div class="dropdown is-hoverable is-right" v-if="can">
			<div class="dropdown-trigger">
				<button class="button is-compact is-borderless" aria-haspopup="true">
					<i class="icon fas fa-ellipsis-v"></i>
				</button>
			</div>
			<div class="dropdown-menu" role="menu">
				<div class="dropdown-content">
					<div class="dropdown-label" v-text="trans.get('foundation::general.options')"></div>
					<slot></slot>
					<router-link v-if="editroute" :to="editroute" class="dropdown-item">
						<i class="icon fas fa-edit has-color-grey-darker"></i> {{ editlabel }}
					</router-link>
					<a href="#" class="dropdown-item has-color-danger" @click.prevent="openDeleteModal()">
						<i class="icon fas fa-trash"></i> {{ trans.get(deletelabel) }}
					</a>
				</div>
			</div>
		</div>
	</td>
</template>

<script>
export default {
	props: ['editroute', 'editlabel', 'deletepayload', 'deletelabel', 'can'],
	methods: {
		openDeleteModal() {
			Event.$emit('delete-modal-open', this.deletepayload)
		}
	}
}
</script>