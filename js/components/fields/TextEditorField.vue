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
	mounted() {
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
				header: Header,
				quote: {
					class: Quote,
					inlineToolbar: true
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
				warning: Warning,
				code: CodeTool,
				raw: RawTool,
				inlineCode: InlineCode,
				marker: Marker,
				underline: Underline,
				hyperlink: Hyperlink,
				style: Style
			}
		})

		self.editor = editor

		Event.$on('resource-loaded', function(data) {
			self.refreshValue(data[self.name][self.locale])
		})
	},
	methods: {
		refreshValue(data) {
			this.editor.clear()
			this.data = (data || {blocks:[]})
			this.editor.render(this.data)
			this.editor.focus(true)
		}
	},
	beforeDestroy() {
		Event.$off('resource-loaded')
	}
}
</script>