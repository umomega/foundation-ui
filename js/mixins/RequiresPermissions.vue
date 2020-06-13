<script>
import Permissions from './Permissions'
import store from '../store'

export default {
	mixins: [ Permissions ],
	beforeRouteEnter: (to, from, next) => {
		next(vm => {
			if(!vm.$can(vm.guardedBy)) router.push({ name: 'errors.unauthorized' })
		})
	}
}
</script>