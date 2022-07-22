<template>
<div id="app">
	<b-overlay :show="show" rounded="sm">
        <component :is="layout">
            <router-view />
        </component>
    </b-overlay>
</div>
</template>

<script>

import LayoutFull from './layouts/full.vue'

import {
	BOverlay
} from 'bootstrap-vue'

export default {
    name: 'App',
	data() {
		return {
			show: false,
		}
	},
    components: {
		LayoutFull,
		BOverlay
    },
	computed: {
		layout() {
            // if (this.$route.meta.layout === 'full') return 'layout-full'
            // return `layout-${this.contentLayoutType}`

			return 'layout-full'
        },
	}
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    min-height: 100vh;
}

a:hover {
	text-decoration: none !important;
}
</style>
