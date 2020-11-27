<template>
	<div :class="isInvalid ? 'single-medium is-invalid' : 'single-medium'">
		<div class="single-medium__progress" v-if="isUploading">
			<div class="single-medium__progress-bar" :style="'width: ' + progress + '%'"></div>
		</div>
		<div class="single-medium__info">
			<div class="single-medium__thumb">
				<div v-if="!isUploading">
					<img class="single-medium__image" v-if="medium.type == 'image' && medium.thumbnail_url" :src="medium.thumbnail_url">
					<div class="single-medium__icon" v-else>
						<span class="icon">
							<i :class="thumbnailIcon"></i>
						</span>
					</div>
				</div>
			</div>
			<p class="single-medium__name" v-text="isInvalid ? trans.get('media::media.invalid_medium') : file.name"></p>
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