<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<div :class="errors.has(translatable ? name + '.' + locale : name) ? 'select is-fullwidth is-danger' : 'select is-fullwidth'">
				<select :name="name" :required="options.required" :readonly="readonly" :disabled="readonly" @input="$emit('input', $event.target.value)">
					<option v-text="trans.get('foundation::general.choose_one')" value=""></option>
					<option v-for="option in options.choices" :value="option.value" v-text="option.label" :selected="value == option.value"></option>
				</select>
			</div>
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'

export default {
	mixins: [ Field ]
}
</script>