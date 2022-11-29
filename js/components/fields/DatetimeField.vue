<template>
	<div>
		<label v-if="label != undefined" class="label is-uppercase">{{ label }}</label>
		<div ref="picker">
			<div class="control has-icons-left">
				<span class="icon is-small is-left">
			      <i class="fas fa-calendar-alt has-color-grey-light"></i>
			    </span>
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
					<DatePicker v-model="date" mode="dateTime" is24hr :locale="{ id: $root.locale, firstDayOfWeek: 2 }" @input="updateDate()"/>
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
			date: (this.value != '' && this.value != null ? new Date(this.value.replace(/ /g, "T")) : null)
		}
	},
	computed: {
		readableDate() {
			if(this.date == null) return null;

			const tzoffset = (new Date()).getTimezoneOffset() * 60000
			return (new Date(this.date - tzoffset)).toISOString().replace('T', ' ').substring(0, this.date.toISOString().length - 5)
		}
	},
	created() {
		this.updateDate()
	},
	watch: {
		value(to) {
			this.date = (to != '' && to != null ? new Date(to.replace(/ /g, "T")) : null)
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
        updateDate() {
        	this.$emit('input', this.readableDate)
        },
		attemptHidePicker(e) {
            let el = this.$refs.picker,
                target = e.target;
            if(el !== target && !el.contains(target)) {
                this.hidePicker()
            }
        }
	}
}
</script>