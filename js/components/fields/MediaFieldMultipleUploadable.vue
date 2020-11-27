<template>
	<div class="multiple-media__slide" v-if="isUploading">
		<div class="multiple-media__progress">
			<div class="multiple-media__progress-bar" :style="'width: ' + progress + '%'"></div>
		</div>
	</div>
</template>

<script>
// I just don't get why this does not work with normal inclusion but CBA honestly
import Uploadable from '../../../../umomega-media/js/mixins/Uploadable'

export default {
	mixins: [Uploadable]
}
</script>