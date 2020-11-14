<template>
	<div>
		<label class="label">{{ label }}</label>
		<div class="control">
			<input type="number"
				:class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'"
				:name="name"
				:value="value"
				@input="$emit('input', $event.target.value)"
				:placeholder="placeholder"
				:required="options.required"
				:readonly="readonly"
				:disabled="readonly"
				:min="options.min"
				:max="options.max"
				:step="options.step">
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-text="hint"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'

export default {
	mixins: [ Field ]
}
</script>