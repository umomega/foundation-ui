<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div class="control">
			<textarea
				:class="errors.has(translatable ? name + '.' + locale : name) ? 'textarea is-danger' : 'textarea'"
				:name="name"
				:value="value"
				@input="$emit('input', $event.target.value)"
				:placeholder="placeholder"
				:required="options.required"
				:readonly="readonly"
				:disabled="readonly">
			</textarea>
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