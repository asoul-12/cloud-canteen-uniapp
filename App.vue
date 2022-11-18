<script>
	import {interceptos} from '@/fetch/api.js';
	export default {
		onLaunch: function() {
			interceptos();
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
