<template>
	<div :class="isInvalid ? 'medium medium--static is-invalid' : 'medium medium--static'" v-if="isUploading">
		<div class="medium-thumbnail">
			<div class="medium-progress">
				<div class="medium-progress-bar" :style="'width: ' + progress + '%'"></div>
			</div>
		</div>
		<p class="medium-filename" v-text="isInvalid ? trans.get('media::media.invalid_medium') : file.name"></p>
	</div>
</template>

<script>
// I just don't get why this does not work with normal inclusion but CBA honestly
import Uploadable from '../../../umomega-media/js/mixins/Uploadable'
export default {mixins: [Uploadable]}
</script>