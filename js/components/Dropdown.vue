<template>
	<div class="dropdown is-hoverable is-right">
		<div class="dropdown-trigger">
			<button class="tools-navigation__button" aria-haspopup="true">
				<slot name="dropdown-button"></slot>
			</button>
		</div>
		<div class="dropdown-menu" role="menu">
			<div class="dropdown-content">
				<div class="dropdown-label"><slot name="dropdown-label"></slot></div>
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
export default {}
</script>