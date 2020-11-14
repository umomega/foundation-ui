<template>
	<div>
		<label class="label">{{ label }}</label>
		<div ref="picker">
			<div class="control">
				<input type="text"
					:class="errors.has(translatable ? name + '.' + locale : name) ? 'input is-danger' : 'input'"
					:name="name"
					:value="readableDate"
					@focus="showPicker()"
					:placeholder="placeholder"
					:required="options.required"
					:readonly="true"
					:disabled="readonly">
			</div>
			<div class="is-relative">
				<div v-if="displayPicker" class="picker date-picker">
					<DatePicker v-model="date" mode="dateTime" is24hr :first-day-of-week="2"/>
				</div>
			</div>
		</div>	
		<p class="help is-danger" v-if="anyErrors()" v-text="getErrorMessage()"></p>
		<p class="help" v-else v-html="hint"></p>
	</div>
</template>

<script>
import Field from '../../mixins/Field'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
	mixins: [ Field ],
	components: { DatePicker },
	data() {
		return {
			displayPicker: false,
			date: this.value || new Date(),
			settings: {
				hightlight: {
					color: 'red'
				}
			}
		}
	},
	computed: {
		readableDate() {
			return this.date.toISOString().replace('T', ' ').substring(0, this.date.toISOString().length - 5)
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
			this.date = n
		}
	}
}
</script>