<template>
	<div :class="activeClass">
		<div class="modal-background" @click="close"></div>
		<div class="modal-card floating-library">
			<div class="modal-card-body floating-library__body">
				<div class="floating-library__row floating-library__row--main" @dragenter.prevent="dragging = true" @dragover.prevent="dragging = true" @dragend.prevent="dragging = false" @dragleave.prevent="dragging = false" @drop.prevent="startUpload">
					<div :class="dragging ? 'floating-library__dropzone floating-library__dropzone--active' : 'floating-library__dropzone'"><span class="icon"><i class="fas fa-3x fa-file-upload has-color-white"></i></span></div>
					<div class="floating-library__main">
						<div class="modal-card-head floating-library__head">
							<h3 class="modal-card-title has-color-grey-darker is-uppercase" v-text="trans.get('foundation::general.library')"></h3>
							<button class="delete is-large is-hidden-tablet" aria-label="close" @click="close"></button>
						</div>
						<div ref="mediaList" class="floating-library__content" v-infinite-scroll="load" infinite-scroll-disabled="busy" infinite-scroll-distance="300">
							<div class="floating-library__list-outer">
								<ul class="floating-library__list columns is-multiline is-mobile is-variable is-1-mobile is-1" v-if="concatMedia.length > 0">
									<li class="column is-one-third-mobile is-one-quarter-tablet is-one-fifth-widescreen is-2-fullhd" v-for="(medium, i) in concatMedia" v-if="isShown(medium, i)" :key="i">
										<div v-if="medium.id != undefined" :class="resource && resource.id == medium.id ? 'medium medium--static medium--highlighted' : 'medium medium--static'" @click="highlight(medium)">
											<div class="medium-thumbnail">
												<img class="medium-thumbnail-image" v-if="medium.thumbnail_url" :src="medium.thumbnail_url">
												<div class="medium-thumbnail-icon" v-if="medium.type != 'image'">
													<span class="icon is-large">
														<i :class="thumbnailIcon(medium.type)"></i>
													</span>
												</div>
												<label :class="checked.includes(medium.id) ? 'medium-checkbox is-checked' : 'medium-checkbox'">
													<input class="is-hidden" type="checkbox" :value="medium.id" v-model="checked" @change="toggleSelect(medium)">
													<span class="icon has-color-white">
														<i :class="checked.includes(medium.id) ? 'far fa-check-square' : 'far fa-square'"></i>
													</span>
												</label>
											</div>
											<p class="medium-filename" v-text="medium.name"></p>
										</div>
										<FloatingLibraryUploadCard v-if="medium.id == undefined && medium.name" :file="medium" :key="i"/>
									</li>
								</ul>
								<div v-else class="has-text-centered pt-xxl pb-x xl pr-md pl-md" v-text="trans.get('foundation::general.no_results_found')"></div>
							</div>
						</div>
					</div>
					<div class="floating-library__side">
						<div class="modal-card-head floating-library__head">
							<h3 class="modal-card-title has-color-primary is-uppercase" v-text="trans.get('foundation::general.details')"></h3>
							<button class="delete is-large" aria-label="close" @click="close"></button>
						</div>
						<div class="floating-library__content" ref="sideColumn">
							<div class="floating-library__content-inner">
								<div v-if="resource">
									<div class="medium-preview has-text-centered">
										<img v-if="resource.type == 'image'" :src="resource.compact_url">
										<video v-if="resource.type == 'video'" controls>
											<source :src="resource.public_url" :type="resource.metadata.mimetype">
										</video>
										<audio v-if="resource.type == 'audio'" :src="resource.public_url" controls></audio>
										<div v-if="resource.type == 'embed' && resource.metadata.code && resource.metadata.code.html" v-html="resource.metadata.code.html"></div>
									</div>
									<p class="is-size-9 has-color-grey-darker has-text-centered mb-md" v-text="metadata"></p>
									<form method="POST" action="/api/media" @submit.prevent="requestUpdate('media', '', resource.id)" @change="clearError($event.target.name)" autocomplete="off">
										<FormBody :schema="schema" v-model="form" :readonly="!$can('write_media')" class="mb-lg"/>
										
										<div class="contents-navigation__locales mb-lg">
											<a v-for="locale in resource.locales" href="#" :class="'contents-navigation__locale' + (locale == editingLocale ? ' contents-navigation__locale--active' : '' )" @click.prevent="editingLocale = locale" v-text="locale"></a>
										</div>
										<div v-for="locale in resource.locales" class="mb-lg">
											<FormBody :class="locale == editingLocale ? '' : 'is-sr-only'" :schema="schemaSecondary" v-model="form" :readonly="!$can('write_media')" :translatable="true" :translatableFields="translatableFields" :locale="locale"/>
										</div>
										<button class="button is-fullwidth is-primary is-outlined is-uppercase" v-text="trans.get('foundation::general.save_changes')"></button>
									</form>
								</div>
								<p v-else class="pt-xxl pb-xxl pl-sm pr-sm has-text-centered" v-text="trans.get('media::media.no_media_selected')"></p>
							</div>
						</div>
					</div>
				</div>
				<div class="floating-library__row floating-library__row floating-library__row--bottom">
					<div class="floating-library__main floating-library__selection-outer">
						<div class="floating-library__footer">
							<div class="is-flex">
								<div class="pr-sm floating-library__info">
									<p class="is-size-7 is-uppercase has-color-primary has-text-weight-semibold" v-text="trans.get('media::media.multiple')"></p>
									<p class="is-size-9">{{ selectedCount + ' ' + trans.get('foundation::general.selected') }}</p>
								</div>
								<div v-if="payload.multiple || (!payload.multiple && payload.selected)">
									<draggable v-if="payload.multiple" v-model="payload.selected" :tag="'ul'" class="floating-library__selection" :animation="200">
										<li v-for="(medium,i) in payload.selected" :class="resource && medium.id == resource.id ? 'floating-library__selected floating-library__selected--highlighted' : 'floating-library__selected'" @click="highlight(medium)">
											<img :src="medium.thumbnail_url" v-if="medium.thumbnail_url" class="floating-library__image">
											<div class="floating-library__icon" v-if="medium.type != 'image'">
												<span class="icon is-medium">
													<i :class="thumbnailIcon(medium.type)"></i>
												</span>
											</div>
										</li>
									</draggable>
									<div v-else>
										<li v-if="payload.selected" :class="resource && payload.selected.id == resource.id ? 'floating-library__selected floating-library__selected--highlighted' : 'floating-library__selected'" @click="highlight(payload.selected)">
											<img :src="payload.selected.thumbnail_url" v-if="payload.selected.thumbnail_url" class="floating-library__image">
											<div class="floating-library__icon" v-if="payload.selected.type != 'image'">
												<span class="icon is-medium">
													<i :class="thumbnailIcon(payload.selected.type)"></i>
												</span>
											</div>
										</li>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="floating-library__side floating-library__buttons-outer">
						<div class="floating-library__footer has-text-right">
							<button class="button is-white has-color-danger is-uppercase" v-text="trans.get('foundation::general.clear')" @click="clear"></button>
							<button class="button is-primary is-uppercase" @click="insert">
								<span class="icon-flap"><span class="icon fas fa-photo-video"></span></span>
								<span>{{ trans.get('foundation::general.done') }}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FormBody from './FormBody'
import Form from '../classes/form'
import {format_date, readable_file_size} from '../helpers'
import RequiresPermissions from '../mixins/RequiresPermissions'
import FloatingLibraryUploadCard from './FloatingLibraryUploadCard'
import Updater from '../mixins/Updater'
import {assess_error} from '../helpers'
import infiniteScroll from 'vue-infinite-scroll'
import draggable from 'vuedraggable'

export default {
	directives: { infiniteScroll },
	components: { FormBody, FloatingLibraryUploadCard, draggable },
	mixins: [Updater, RequiresPermissions],
	data() { return {
		payload: {},
		isOpen: false,
		isLoaded: false,
		busy: false,
		media: [],
		page: 1,
		canLoadMore: true,
		checked: [],
		initialSelected: [],
		initialSelectedIds: [],
		resource: null,
		dragging: false,
		editingLocale: this.$root.appLocale,
		uploading: [],
		translatableFields: ['alttext', 'caption', 'description'],
		form: new Form({name: '', public_url: '', alttext: '', caption: '', description: ''}),
		schema: [
			{
				type: 'TextField',
				name: 'name',
				label: this.$root.trans.get('validation.attributes.name'),
				options: {required: true}
			}
		],
		schemaSecondary: [
			{
				type: 'TextField',
				name: 'caption',
				label: this.$root.trans.get('validation.attributes.caption')
			},
			{
				type: 'TextField',
				name: 'alttext',
				label: this.$root.trans.get('validation.attributes.alttext'),
				hint: this.$root.trans.get('media::media.hint_alttext')
			},
			{
				type: 'TextareaField',
				name: 'description',
				label: this.$root.trans.get('validation.attributes.description')
			}
		]
	}},
	computed: {
		activeClass() {
			return this.isOpen ? 'modal is-active' : 'modal'
		},
		concatMedia() {
			if(this.payload.multiple && Array.isArray(this.initialSelected)) {
				return this.initialSelected.concat(this.uploading.concat(this.media))
			} else if(!this.payload.multiple && !Array.isArray(this.initialSelected) && typeof this.initialSelected === 'object') {
				return [this.initialSelected].concat(this.uploading.concat(this.media))
			}

			return this.uploading.concat(this.media)
		},
		selectedCount() {
			return this.payload.multiple ? this.payload.selected.length : (this.payload.selected ? 1 : 0)
		},
		metadata() {
			if(this.resource.metadata == undefined) return
			
			var metadata = format_date(this.resource.created_at) + ' . ' + this.trans.get('media::media.type_' + this.resource.type)

			if(this.resource.type != 'embed') {
				metadata += ' (' + this.resource.metadata.mimetype + ') . ' + readable_file_size(this.resource.metadata.size)
			}

			if(this.resource.type == 'image') {
				metadata += ' . ' + this.resource.metadata.width + ' x ' + this.resource.metadata.height
			}

			return metadata
		},
	},
	mounted() {
		const self = this

		Event.$on('medium-updated', function(data) {
			if(self.payload.multiple) {
				const i = self.initialSelected.findIndex(function(m) { return m.id == data.id })
				// https://stackoverflow.com/questions/44800470/vue-js-updated-array-item-value-doesnt-update-in-page
				if(i >= 0) self.$set(self.initialSelected, i, data)

				const j = self.payload.selected.findIndex(function(m) { return m.id == data.id })
				if(j >= 0) self.$set(self.payload.selected, j, data)
			} else {
				if(self.initialSelected && self.initialSelected.id == data.id) self.initialSelected = data
				if(self.payload.selected && self.payload.selected.id == data.id) self.payload.selected = data
			}

			const k = self.media.findIndex(function(m) { return m.id == data.id })
			self.$set(self.media, k, data)
		})

		Event.$on('upload-complete', function(data) {
			self.media.unshift(data.payload)

			// Self upload, so select
			if(data.name == 'undefined') {
				const i = self.uploading.findIndex(function(f) { return f.name == data.file.name })
				self.uploading.splice(i, 1)

				if(self.payload.multiple) {
					self.checked.unshift(data.payload.id)
				} else {
					self.checked = [data.payload.id]
				}

				self.toggleSelect(data.payload)
				self.highlight(data.payload)
			}
		})
		
		Event.$on('floating-library-open', function(payload) {
			document.querySelector('html,body').classList.add('is-clipped')
			document.addEventListener('keydown', function(e) {
				if(e.keyCode == 27) self.close()
			})

			self.isOpen = true

			// This was to keep changes made but if we do this
			// new uploads are shown twice
			//if(self.payload.name == payload.name) return

			// To break the reactivity
			payload = JSON.parse(JSON.stringify(payload))
			if(!payload.multiple && ((payload.selected != null && payload.selected.length == 0) || payload.selected == '')) payload.selected = null
			self.payload = payload

			if(self.$refs.mediaList) self.$refs.mediaList.scrollTop = 0
			if(self.$refs.sideColumn) self.$refs.sideColumn.scrollTop = 0

			if(payload.multiple && Array.isArray(payload.selected)) {
				self.checked = self.initialSelectedIds = payload.selected.map(function(medium) { return medium.id })
				self.initialSelected = JSON.parse(JSON.stringify(payload.selected))
			} else if(!payload.multiple && payload.selected) {
				self.checked = self.initialSelectedIds = [payload.selected.id]
				self.initialSelected = JSON.parse(JSON.stringify(payload.selected))
				self.highlight(payload.selected)
			} else {
				self.checked = self.initialSelectedIds = []
				self.initialSelected = []
			}

			if(!self.isLoaded) {
				self.load()
			}
		})

		Event.$on('floating-library-close', function() {
			document.querySelector('html,body').classList.remove('is-clipped')
			document.removeEventListener('keydown', self.close)

			self.isOpen = false

			self.payload = {}
			self.checked = []
			self.initialSelectedIds = []
			self.initialSelected = []
			self.resource = null
		})
	},
	methods: {
		close() {
			Event.$emit('floating-library-close')
		},
		clear() {
			this.payload.selected = this.payload.multiple ? [] : null

			this.insert()
		},
		highlight(medium) {
			this.resource = medium
			this.editingLocale = this.$root.appLocale
			this.form.populate(medium)

			if(this.$refs.sideColumn) this.$refs.sideColumn.scrollTop = 0
		},
		insert() {
			Event.$emit('media-field-updated', {
				name: this.payload.name,
				selected: this.payload.selected
			})

			this.close()
		},
		toggleSelect(medium) {
			if(this.checked.includes(medium.id)) {
				if(this.payload.multiple) {
					this.payload.selected.push(medium)
				} else {
					this.checked = [medium.id]
					this.payload.selected = medium
				}
			} else {
				if(this.payload.multiple) {
					const i = this.payload.selected.findIndex(function(m) { return m.id == medium.id})
					this.payload.selected.splice(i, 1)
				}
				// We do nothing for the single mode
			}
		},
		load() {
			const self = this

			if(!self.canLoadMore) return

			self.busy = true

			axios.get(api_url_with_token('media') + '&page=' + self.page)
				.then(function(response) {
					self.busy = false
					self.media = self.media.concat(response.data.data)
					self.isLoaded = true
					self.page = self.page + 1
					if(response.data.data.length < 30) self.canLoadMore = false
				})
				.catch(function(error) { assess_error(error) })
		},
		thumbnailIcon(type) {
			return 'fas fa-' + (type == 'document' ? 'file' : 'file-' + type)
		},
		isShown(medium, i) {
			return (medium.id == undefined && medium.name) || (!this.initialSelectedIds.includes(medium.id) || (this.initialSelectedIds.includes(medium.id) && i < this.initialSelectedIds.length)) && (!this.payload.filters || (this.payload.filters && this.payload.filters.includes(medium.type)))
		},
		startUpload(e) {
			this.dragging = false
			
			let files = e.dataTransfer ? e.dataTransfer.files : e.target.files
			if(!files) return

			files = [...files]

			for(let f in [...files]) {
				let fl = files[f]
				if(this.validateFile(fl)) {
					this.uploading.push(fl)
				}
			}
		},
		validateFile(file) {
			return this.$root.shared.allowed_size
			//return this.$root.shared.allowed_size >= file.size && this.$root.shared.allowed_mimetypes.includes(file.type)
		},
		clearError(field) {
			if(this.translatableFields.includes(field)) {
				this.form.errors.clear(field + '.' + this.editingLocale)
			} else {
				this.form.errors.clear(field)
			}
		}
	}
}
</script>