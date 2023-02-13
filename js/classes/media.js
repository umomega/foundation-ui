import { IconPicture } from '@codexteam/icons';

export default class Media {

	static get toolbox() {
		return {
			title: 'Media',
			icon: IconPicture
		}
	}

	constructor({ data }) {
		this.data = data || {}
		this.wrapper = undefined
		this.selection = undefined
		this.name = ''

		const self = this

		Event.$on('media-field-updated', function (data) {
			if (data.name == self.name) {
				self.data.media = data.selected

				self.createSelection()

				Event.$emit('editor-content-updated')
			}
		})
	}

	render() {
		this.wrapper = document.createElement('div')
		this.wrapper.className = 'editor-field-media'

		this.selection = document.createElement('div')
		this.selection.className = 'media-field editor-field-media__selection mb-sm'

		this.createSelection()

		this.wrapper.appendChild(this.selection)

		this._createButton()

		return this.wrapper
	}

	save() {
		return {
			media: ((this.data && this.data.media) ? this.data.media : [])
		}
	}

	createSelection() {
		this.selection.innerHTML = ''

		if (this.data && this.data.media && this.data.media.length > 0) {
			if (this.data.media.length == 1) {
				const medium = this.data.media[0]

				if (medium.type == 'image') {
					const image = document.createElement('img')
					image.setAttribute('src', medium.public_url)

					this.selection.className = 'editor-field-media__selection mb-sm'
					this.selection.appendChild(image)
				} else if (medium.type == 'embed' && medium.metadata.code && medium.metadata.code.html) {
					this.selection.className = 'editor-field-media__selection mb-sm'
					this.selection.innerHTML = (medium.metadata.code && medium.metadata.code.html ? medium.metadata.code.html : '')
				} else {
					const wrapper = document.createElement('div')
					wrapper.className = 'single-medium__info'

					const thumb = document.createElement('div')
					thumb.className = 'single-medium__thumb'

					const thumbInner = document.createElement('div')
					thumbInner.className = 'single-medium__icon'

					const iconOuter = document.createElement('span')
					iconOuter.className = 'icon'

					const icon = document.createElement('i')
					icon.className = this._thumbnailIcon(medium.type)

					iconOuter.appendChild(icon)
					thumbInner.appendChild(iconOuter)
					thumb.appendChild(thumbInner)
					wrapper.appendChild(thumb)

					const name = document.createElement('p')
					name.className = 'single-medium__name'
					name.appendChild(document.createTextNode(medium.name))

					wrapper.appendChild(name)

					this.selection.className = 'media-field editor-field-media__selection mb-sm'
					this.selection.appendChild(wrapper)
				}
			} else {
				const wrapper = document.createElement('div')
				wrapper.className = 'multiple-media multiple-media--disabled'

				const self = this

				this.data.media.forEach(function (medium) {
					const slide = document.createElement('li')
					slide.className = 'multiple-media__slide'

					if (medium.thumbnail_url) {
						const image = document.createElement('img')
						image.className = 'multiple-media__image'
						image.setAttribute('src', medium.thumbnail_url)

						slide.appendChild(image)
					} else {
						const thumb = document.createElement('div')
						thumb.className = 'multiple-media__icon'

						const iconOuter = document.createElement('span')
						iconOuter.className = 'icon is-large'

						const icon = document.createElement('i')
						icon.className = self._thumbnailIcon(medium.type)
						iconOuter.appendChild(icon)
						thumb.appendChild(iconOuter)

						slide.appendChild(thumb)
					}

					wrapper.appendChild(slide)
				})

				this.selection.appendChild(wrapper)
			}
		} else {
			const emptyPrompt = document.createElement('div')
			emptyPrompt.className = 'has-text-centered pt-xs pb-xs'

			const heading = document.createElement('p')
			heading.appendChild(document.createTextNode(trans.get('media::media.no_media_selected')))
			emptyPrompt.appendChild(heading)

			if (!this.readOnly) {
				const subheading = document.createElement('p')
				subheading.className = 'is-size-8 has-color-grey'
				subheading.appendChild(document.createTextNode(trans.get('media::media.select_from_library')))

				emptyPrompt.appendChild(subheading)
			}

			this.selection.appendChild(emptyPrompt)
		}
	}

	_createButton() {
		if (this.readOnly) return

		const button = document.createElement('button')
		button.className = 'button is-light is-uppercase'
		button.setAttribute('type', 'button')

		const buttonText = document.createElement('span')
		buttonText.appendChild(document.createTextNode(trans.get('foundation::general.library')))

		const icon = document.createElement('span')
		icon.className = 'icon fas fa-photo-video'

		const iconOuter = document.createElement('span')
		iconOuter.className = 'icon-flap'
		iconOuter.appendChild(icon)
		button.appendChild(iconOuter)

		button.appendChild(buttonText)

		const self = this

		button.addEventListener('click', function () {
			const selected = ((self.data && self.data.media && self.data.media != '') ? self.data.media : [])

			const name = Math.random().toString(36).substring(7)
			self.name = name

			Event.$emit('floating-library-open', {
				name: name,
				selected: selected,
				multiple: true,
				filters: false
			})
		})

		this.wrapper.appendChild(button)
	}

	_thumbnailIcon(type) {
		return 'fas fa-3x fa-' + (type == 'document' ? 'file' : 'file-' + type)
	}

}