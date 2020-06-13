<template>
	<div class="tabs is-umokit is-centered">
		<ul>
			<li v-for="tab in tabs" :class="{ 'is-active': tab.active }"><router-link  v-if="tab.show ? $can(tab.show) : true" :to="{ name: tab.route }">{{ trans.get(tab.label) }}</router-link></li>
		</ul>
	</div>
</template>

<script>
import Permissions from '../mixins/Permissions';

export default {
	props: ['tabs'],
	mixins: [ Permissions ]
}
</script>