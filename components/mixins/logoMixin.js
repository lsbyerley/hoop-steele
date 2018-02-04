import { teams } from '@/utils/cbbData'
import Fuse from 'fuse.js'

const searchOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [ "location", "kpTeamName" ]
};
const logoFuse = new Fuse(teams, searchOptions);

export const logoMixin = {
  methods: {
    getTeamLogo(team) {
      const logoResult = logoFuse.search(team.team);
      if (logoResult.length > 0) {
        const teamId = logoResult[0].id
        return `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${teamId}.png&h=150&w=150`
      } else {
        return 'https://placehold.it/150x150'
      }
    }
  }
}
