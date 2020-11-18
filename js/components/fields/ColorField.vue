<template>
	<div>
		<label class="label">{{ label }}</label>
		<div ref="picker" class="mb-lg">
			<div class="field has-addons mb-none">
				<div class="control">
					<button type="button" class="button is-white is-compact color-swatch" :disabled="readonly" @click="showPicker()" :style="'background-color:' + colors.hex"></button>
				</div>
				<div class="control is-fullwidth">
					<input type="text"
						:class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'"
						:name="name"
						:value="colors.hex"
						@focus="showPicker()"
						:placeholder="placeholder"
						:required="options.required"
						:readonly="true"
						:disabled="readonly">
				</div>
			</div>
			<div class="is-relative">
				<Chrome v-if="displayPicker" class="picker color-picker" v-model="colors" @input="updateColor()"/>
			</div>
			<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
			<p class="help" v-else v-html="hint"></p>
		</div>
	</div>
</template>

<script>
import Field from '../../mixins/Field'
import { Chrome } from 'vue-color'

export default {
	mixins: [ Field ],
	components: { Chrome },
	data() {
		return {
			displayPicker: false,
			colors: (this.value ?: this.value : {hex: '#00249C'})
		}
	},
	methods: {
		showPicker() {
			if(this.readonly) return
			document.addEventListener('click', this.attemptHidePicker)
			this.displayPicker = true
		},
		hidePicker() {
            document.removeEventListener('click', this.attemptHidePicker)
            this.displayPicker = false
        },
        updateColor() {
        	this.$emit('input', this.colors)
        },
		attemptHidePicker(e) {
            let el = this.$refs.picker,
                target = e.target;
            if(el !== target && !el.contains(target)) {
                this.hidePicker()
            }
        }
	},
	watch: {
		value: function(n) {
			this.colors = n
		}
	}
}
</script>