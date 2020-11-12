<template>
	<div>
		<label class="label">{{ label }}</label>
		<div ref="colorpicker">
			<div class="field has-addons">
				<div class="control">
					<button type="button" class="button is-white is-compact" @click="showPicker()" :style="'background-color:' + colors.hex"></button>
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
				<Chrome v-if="displayPicker" class="color-picker" v-model="colors" @input="updateColor()"/>
			</div>
		</div>
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
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
			colors: this.value
		}
	},
	methods: {
		showPicker() {
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
            let el = this.$refs.colorpicker,
                target = e.target;
            if(el !== target && !el.contains(target)) {
                this.hidePicker()
            }
        }
	}
}
</script>