<template>
    <div>
        <label class="label">{{ label }}</label>
        <div class="control">
            <div class="pt-xs pb-xs">
                <label class="toggle">
                    <input class="toggle-checkbox" type="checkbox"
                        :name="name"
                        @input="$emit('input', $event.target.checked)"
                        :checked="value == 1"
                        :readonly="readonly"
                        :disabled="readonly">
                    <span class="toggle-outer">
                        <span class="toggle-switch"></span>
                        <span class="toggle-true" v-text="trans.get('foundation::general.yes')"></span>
                        <span class="toggle-false" v-text="trans.get('foundation::general.no')"></span>
                    </span>
                </label>
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