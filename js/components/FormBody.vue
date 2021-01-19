<template>
	<div>
		<div :class="Array.isArray(field) ? '' : 'field'" v-for="(field, index) in schema">
			<div v-if="Array.isArray(field)" class="field-group">
				<component v-for="(subfield, index) in field"
					:key="index"
					:is="subfield.type"
					:value="getFieldFor(subfield.name)"
					:errors="form.errors"
					:options="subfield.options || {}"
					@input="updateForm(subfield.name, $event)"
					v-bind="subfield"
					:readonly="subfield.options && subfield.options.readonly != undefined ? subfield.options.readonly : readonly"
					:translatable="translatable"
					:locale="locale">
				</component>
			</div>
			<component v-else
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
	import CheckboxField from './fields/CheckboxField'
	import ColorField from './fields/ColorField'
	import NumberField from './fields/NumberField'
	import DatetimeField from './fields/DatetimeField'
	import MediaField from './fields/MediaField'
	import TextEditorField from './fields/TextEditorField'
	import CodeField from './fields/CodeField'
	import RangeField from './fields/RangeField'

	export default {
		components: { TextField, TextareaField, EmailField, PasswordField, RelationField, SelectField, CheckboxField, ColorField, NumberField, DatetimeField, MediaField, TextEditorField, CodeField, RangeField },
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

				this.form.errors.clear(fieldName);

				Event.$emit('input', this.form);
			},
			getFieldFor(name)
			{
				if(this.translatable) {
					if(Array.isArray(this.form[name]) || this.form[name] == null) this.form[name] = {}

					if(this.form[name][this.locale] == undefined) {
						var schemaField = null

						for(var i = 0; i < this.schema.length; i++)
						{
							if(this.schema[i].name == name) {
								schemaField = this.schema[i]
								break
							}
						}

						this.form[name][this.locale] = (schemaField && schemaField.default_value != undefined ? schemaField.default_value : '')
					}

					return this.form[name][this.locale]
				}

				return this.form[name]
			}
		}
	};
</script>