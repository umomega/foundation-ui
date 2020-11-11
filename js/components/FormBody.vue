<template>
	<div>
		<component v-for="(field, index) in schema"
			:key="index"
			:is="field.type"
			:value="getFieldFor(field.name)"
			:errors="form.errors"
			:options="field.options || {}"
			@input="updateForm(field.name, $event)"
			v-bind="field"
			:readonly="field.options && field.options.readonly != undefined ? field.options.readonly : readonly"
			:translatable="translatable"
			:locale="locale">
		</component>
	</div>
</template>

<script>
	// https://github.com/e-schultz/vue-dynamic-components/blob/master/src/components/v5/FormGenerator.vue
	// https://github.com/laracasts/Vue-Forms/blob/master/resources/views/projects/create.blade.php
	import TextField from './fields/TextField'
	import TextareaField from './fields/TextareaField'
	import EmailField from './fields/EmailField'
	import PasswordField from './fields/PasswordField'
	import RelationField from './fields/RelationField'
	import SelectField from './fields/SelectField'

	export default {
		components: { TextField, TextareaField, EmailField, PasswordField, RelationField, SelectField },
		props: ['schema', 'value', 'readonly', 'translatable', 'locale'],
		data() {
			return {
				form: this.value || {}
			}
		},
		methods: {
			updateForm(fieldName, value) {
				if(this.translatable) {
					this.$set(this.form[fieldName], this.locale, value)
				} else {
					this.$set(this.form, fieldName, value);
				}
				Event.$emit('input', this.form);
			},
			getFieldFor(name)
			{
				if(this.translatable) {
					if(Array.isArray(this.form[name])) this.form[name] = {}
					if(this.form[name][this.locale] == undefined) this.form[name][this.locale] = ''
					return this.form[name][this.locale]
				}

				return this.form[name]
			}
		}
	};
</script>