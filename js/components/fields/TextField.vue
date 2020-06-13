<template>
	<div class="field">
		<label class="label">{{ label }}</label>
		<div class="control">
			<input type="text"
				:class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'"
				:name="name"
				:value="value"
				@input="$emit('input', $event.target.value)"
				:placeholder="placeholder"
				:required="options.required"
				:readonly="readonly"
				:disabled="readonly">
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'

export default {
	mixins: [ Field ]
}
</script>