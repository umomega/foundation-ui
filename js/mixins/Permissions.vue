<script>
import store from '../store'

export default {
	methods: {
		$can(permission) {
			return (store.user.all_permissions.indexOf('superadmin') !== -1) || (store.user.all_permissions.indexOf(permission) !== -1)
		},
	},
};
</script>