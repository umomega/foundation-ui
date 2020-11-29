<template>
	<div class="media-field-outer">
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<div :class="!readonly && dragging ? 'media-field is-active' : 'media-field'" @dragenter.prevent="dragging = true" @dragover.prevent="dragging = true" @dragend.prevent="dragging = false" @dragleave.prevent="dragging = false" @drop.prevent="startUpload">
				<div v-if="selected.length == 0 && uploading == null && uploadingMultiple.length == 0" class="has-text-centered pt-xs pb-xs">
					<p v-text="trans.get('media::media.no_media_selected')"></p>
					<p v-if="!readonly" v-text="trans.get('media::media.drag_and_drop_to_upload')" class="is-size-8 has-color-grey"></p>
				</div>
				<div v-else>
					<div v-if="options.multiple">
						<draggable v-model="selected" :sort="!readonly" :tag="'ul'" :class="readonly ? 'multiple-media multiple-media--disabled' : 'multiple-media'" :animation="200" @end="updateValue">
							<li v-for="(medium, i) in selected" class="multiple-media__slide" :key="i">
								<img :src="medium.thumbnail_url" v-if="medium.thumbnail_url" class="multiple-media__image">
								<div class="multiple-media__icon" v-if="medium.type != 'image'">
									<span class="icon is-large">
										<i :class="thumbnailIcon(medium.type)"></i>
									</span>
								</div>
								<span class="delete" @click="remove(i)"></span>
							</li>
							<MediaFieldMultipleUploadable v-for="(upload, j) in uploadingMultiple" :file="upload" :name="name" :locale="locale" :key="1000 + j"/>
						</draggable>
					</div>
					<div v-else>
						<MediaFieldSingleUploadable :file="uploading" v-if="uploading != null" :name="name" :locale="locale"/>
						<div v-else>
							<div class="single-medium">
								<div class="single-medium__info">
									<div class="single-medium__thumb">
										<img class="single-medium__image" v-if="selected.type == 'image' && selected.thumbnail_url" :src="selected.thumbnail_url">
										<div class="single-medium__icon" v-else>
											<span class="icon">
												<i :class="thumbnailIcon(selected.type)"></i>
											</span>
										</div>
									</div>
									<p class="single-medium__name" v-text="selected.name"></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<p class="help is-danger mt-sm" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help mt-sm" v-else v-html="hint"></p>
		<div class="mt-sm has-text-right" v-if="!readonly">
			<button class="button is-danger is-inverted has-background-white is-uppercase" v-text="trans.get('foundation::general.clear')" type="button" @click.prevent="clear">
			</button>
			<button class="button is-primary is-uppercase" @click.prevent="openLibrary">
				<span>{{ trans.get('foundation::general.library') }}</span>
				<span class="icon-flap"><span class="icon fas fa-photo-video"></span></span>
			</button>
		</div>
	</div>
</template>

<script>
import SingleMultiple from '../../mixins/SingleMultiple'
import MediaFieldSingleUploadable from './MediaFieldSingleUploadable'
import MediaFieldMultipleUploadable from './MediaFieldMultipleUploadable'

export default {
	mixins: [ SingleMultiple ],
	components: { MediaFieldSingleUploadable, MediaFieldMultipleUploadable },
	data() { return {
		dragging: false,
		uploading: null,
		uploadingMultiple: []
	}},
	mounted() {
		const self = this

		Event.$on('upload-complete', function(data) {
			if(data.name != (self.name + (self.locale ? self.locale : ''))) return

			if(!self.options.multiple) {
				self.uploading = null
				if(!self.options.filters || (self.options.filters && self.options.filters.includes(data.payload.type))) self.selected = data.payload
			} else {
				if(!self.options.filters || (self.options.filters && self.options.filters.includes(data.payload.type))) self.selected.push(data.payload)
			}

			self.updateValue()	
		})

		Event.$on('media-field-updated', function(data) {
			if(data.name != (self.name + (self.locale ? self.locale : ''))) return

			self.selected = data.selected
			self.updateValue()
		})

		self.updateValue()
	},
	beforeDestroy() {
		Event.$off('upload-complete')
	},
	methods: {
		clear() {
			if(this.readonly) return

			this.selected = this.options.multiple ? [] : null

			this.updateValue()
		},
		openLibrary() {
			if(this.readonly) return

			const self = this

			Event.$emit('floating-library-open', {
				name: (self.name + (self.locale ? self.locale : '')),
				selected: self.selected,
				multiple: self.options.multiple,
				filters: self.options.filters
			})
		},
		startUpload(e) {
			if(this.readonly) return

			this.dragging = false

			let files = e.dataTransfer ? e.dataTransfer.files : e.target.files
			if(!files) return

			files = [...files]

			for(let f in [...files]) {
				let fl = files[f]
				if(this.validateFile(fl)) {
					if(this.options.multiple) {
						this.uploadingMultiple.push(fl)
					} else {
						// If it is in single mode we store the first valid upload elsewhere
						// When we receive successful completion that is when we change the calculated value
						this.uploading = fl
						break
					}
				}
			}
		},
		validateFile(file) {
			return this.$root.shared.allowed_size
			//return this.$root.shared.allowed_size >= file.size && this.$root.shared.allowed_mimetypes.includes(file.type)
		},
		thumbnailIcon(type) {
			return 'fas fa-3x fa-' + (type == 'document' ? 'file' : 'file' + type)
		}
	}
}
</script>