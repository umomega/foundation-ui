<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div :class="errors.has(translatable ? name + '.' + locale : name) ? 'editor-field is-danger' : 'editor-field'">
			<div :id="name + '_' + locale"></div>
		</div>
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'

import EditorJS from '@editorjs/editorjs'

import Checklist from '@editorjs/checklist'
import CodeTool from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import RawTool from '@editorjs/raw'
import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import Underline from '@editorjs/underline'
import Warning from '@editorjs/warning'
import Hyperlink from 'editorjs-hyperlink'
import Style from 'editorjs-style'
import Undo from 'editorjs-undo'

import Media from '../../classes/media'

export default {
	mixins: [ Field ],
	data() { return {
		editor: null,
		data: this.value || {}
	}},
	created() {
		const self = this

		const editor = new EditorJS({
			logLevel: 'ERROR',
			holder: self.name + '_' + self.locale,
			data: self.data,
			onReady() {
				const undo = new Undo({ editor })
				undo.initialize(self.data)
			},
			onChange() {
				editor.save().then(savedData => {
					self.$emit('input', savedData)
				})
			},
			inlineToolbar: ['bold', 'italic', 'underline', 'hyperlink', 'marker', 'inlineCode', 'style'],
			autofocus: false,
			defaultBlock: 'paragraph',
			readOnly: self.readonly,
			tools: {
				paragraph: {
					class: Paragraph,
					inlineToolbar: true
				},
				header: {
					class: Header,
					inlineToolbar: true
				},
				quote: {
					class: Quote,
					inlineToolbar: true,
					config: {
						quotePlaceholder: self.$root.trans.get('foundation::general.e_enter_quote'),
						captionPlaceholder: self.$root.trans.get('foundation::general.e_enter_caption')
					}
				},
				list: {
					class: List,
					inlineToolbar: true
				},
				checklist: {
					class: Checklist,
					inlineToolbar: true
				},
				delimiter: Delimiter,
				media: Media,
				image: SimpleImage,
				embed: Embed,
				table: Table,
				warning: {
					class: Warning,
					inlineToolbar: true,
					config: {
						titlePlaceholder: self.$root.trans.get('foundation::general.e_enter_title'),
						messagePlaceholder: self.$root.trans.get('foundation::general.e_enter_message')
					}
				},
				code: {
					class: CodeTool,
					config: { placeholder: self.$root.trans.get('foundation::general.e_enter_a_code') }
				},
				raw: {
					class: RawTool,
					config: { placeholder: self.$root.trans.get('foundation::general.e_enter_html_code') }
				},
				inlineCode: InlineCode,
				marker: Marker,
				underline: Underline,
				hyperlink: Hyperlink,
				style: Style
			},
			i18n: { messages: {
				toolNames: {
					'Text': self.$root.trans.get('foundation::general.e_text'),
					'Heading': self.$root.trans.get('foundation::general.e_heading'),
					'Quote': self.$root.trans.get('foundation::general.e_quote'),
					'List': self.$root.trans.get('foundation::general.e_list'),
					'Checklist': self.$root.trans.get('foundation::general.e_checklist'),
					'Delimiter': self.$root.trans.get('foundation::general.e_delimiter'),
					'Media': self.$root.trans.get('foundation::general.e_media'),
					'Image': self.$root.trans.get('foundation::general.e_image'),
					'Embed': self.$root.trans.get('foundation::general.e_embed'),
					'Table': self.$root.trans.get('foundation::general.e_table'),
					'Warning': self.$root.trans.get('foundation::general.e_warning'),
					'Code': self.$root.trans.get('foundation::general.e_code'),
					'Raw HTML': self.$root.trans.get('foundation::general.e_raw'),
					'InlineCode': self.$root.trans.get('foundation::general.e_inlinecode'),
					'Marker': self.$root.trans.get('foundation::general.e_marker'),
					'Underline': self.$root.trans.get('foundation::general.e_underline'),
					'Hyperlink': self.$root.trans.get('foundation::general.e_hyperlink'),
					'Style': self.$root.trans.get('foundation::general.e_style'),
					'Bold': self.$root.trans.get('foundation::general.e_bold'),
					'Italic': self.$root.trans.get('foundation::general.e_italic')
				},
				ui: {
					'blockTunes': {
						'toggler': {
							'Click to tune': self.$root.trans.get('foundation::general.e_click_to_tune'),
							'Move up': self.$root.trans.get('foundation::general.e_moveup'),
							'Move down': self.$root.trans.get('foundation::general.e_movedown'),
						}
					},
					'inlineToolbar': {
						'converter': {
							'Convert to': self.$root.trans.get('foundation::general.e_convert_to')
						}
					},
					'toolbar': {
						'toolbox': {
							'Add': self.$root.trans.get('foundation::general.add')
						}
					}
				},
				blockTunes: {
					'delete': {
						'Delete': self.$root.trans.get('foundation::general.delete')
					},
					'moveUp': {
						'Move up': self.$root.trans.get('foundation::general.e_moveup')
					},
					'moveDown': {
						'Move down': self.$root.trans.get('foundation::general.e_movedown')
					}
				},
				tools: {
					'hyperlink': {
						'Save': self.$root.trans.get('foundation::general.save'),
						'Select target': self.$root.trans.get('foundation::general.e_select_target'),
						'Select rel': self.$root.trans.get('foundation::general.e_select_rel')
					}
				}
			}}
		})

		self.editor = editor

		Event.$on('resource-loaded', this.listenerTexteditor)
	},
	methods: {
		refreshValue(data) {
			this.editor.clear()
			this.data = (data || {blocks:[]})
			this.editor.render(this.data)
			this.editor.focus(true)
		},
		listenerTexteditor(data) {
			if(data[this.name] != undefined) {
				if(this.locale != '' && this.locale != undefined) {
					this.refreshValue(data[this.name][this.locale])
				} else {
					this.refreshValue(data[this.name])
				}
			}
		}
	},
	beforeDestroy() {
		Event.$off('resource-loaded', this.listenerTexteditor)
	}
}
</script>