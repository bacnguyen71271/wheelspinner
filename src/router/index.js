import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	base: '/',
	scrollBehavior() {
		return { x: 0, y: 0 }
	},
    routes: [
		{
			path: '/',
            component: () => import('@/views/Home.vue'),
		},
        {
            path: '/products',
            component: () => import('@/views/Products.vue'),
        }
    ]
})

export default router