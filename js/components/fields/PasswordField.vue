<template>
	<div v-if="!readonly">
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<div :class="options.meter ? 'field has-addons password-with-meter' : 'field has-addons'">
				<div class="control is-expanded">
					<input :type="this.showPassword ? 'text' : 'password'"
						:class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'"
						:name="name"
						:value="value"
						@input="$emit('input', $event.target.value)"
						:placeholder="placeholder"
						:required="options.required">
				</div>
				<div class="control">
					<button class="button is-compact is-grey-lightest password-toggle" type="button" @click="toggleShow">
						<i :class="buttonIcon"></i>
					</button>
				</div>
			</div>
			<div :class="passwordMeterClass" v-if="options.meter"></div>
		</div>
		
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>
<script>
import zxcvbn from 'zxcvbn'
import Field from '../../mixins/Field'

export default {
	mixins: [ Field ],
	data() {
		return {
			showPassword: false
		}
	},
	methods: {
		toggleShow() {
			this.showPassword = !this.showPassword;
		}
	},
	computed: {
		buttonIcon() {
			return 'icon fas fa-eye' + (this.showPassword ? '-slash' : '')
		},
		passwordMeterClass() {
			const result = zxcvbn(this.value);
			return 'password-meter password-meter--' + result.score;
		}
	}
}
</script>