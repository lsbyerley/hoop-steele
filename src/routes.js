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
      title: 'Steele Hoops: Scoreboard'
    }
  },
  {
    path: '/team-compare',
    component: TeamCompare,
    meta: {
      title: 'Steele Hoops: Team Compare'
    }
  }
]
