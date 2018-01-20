import Scoreboard from './components/Scoreboard.vue'
import TeamCompare from './components/TeamCompare.vue'

export default [
  // Redirects to /route-one as the default route.
  {
    path: '/',
    redirect: '/scoreboard'
  },
  {
    path: '/scoreboard',
    component: Scoreboard,
    meta: {
      title: 'Hoop Steele: Scoreboard'
    }
  },
  {
    path: '/team-compare',
    component: TeamCompare,
    meta: {
      title: 'Hoop Steele: Team Compare'
    }
  }
]
