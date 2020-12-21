<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<div class="code-editor">
				<prism-editor v-model="code" :highlight="highlighter" :line-numbers="true" :readonly="readonly" @input="updateValue"></prism-editor>
			</div>
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'
import {PrismEditor} from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import {highlight, languages} from 'prismjs/components/prism-core'
import 'prismjs/themes/prism-tomorrow.css'

export default {
	mixins: [ Field ],
	components: { PrismEditor },
	data() { return {
		code: this.compileValue()
	}},
	watch: {
		value(to) {
			this.code = this.compileValue()
		}
	},
	methods: {
		highlighter(code) {
    		return highlight(code, languages.clike);
		},
		updateValue(code) {
			this.$emit('input', code)
		},
		compileValue() {
			return this.value || ''
		}
	}
}
</script>