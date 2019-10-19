//TODO: hook up the router, not used yet.
import Vue from 'vue'
import Router from 'vue-router'

import PreGames from '@/components/PreGames'
import HalftimeGames from '@components/HalftimeGames'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/',
			name: 'PreGames',
			component: PreGames
    },
    {
      path: '/halftime',
      name: 'Halftime',
      component: HalftimeGames
    }
  ]
})

export default router;