<div class="field">
  <label class="label">Team One</label>
  <div class="control">
    <div class="select">
      <select name="teamOne" id="teamOne" @input="selectTeam($event.target.value, 'one')">
        <option v-bind:value="null">Select A Team</option>
        <option v-for="team in sortedTeamRatings" v-bind:value="team.team">
          {{ team.team }}
        </option>
      </select>
    </div>
  </div>
</div>

<div class="modal-card-head">
  <div ref="title" class="modal-card-title">{{ selectedTeamOne.team }} vs. {{ selectedTeamTwo.team }}</div>
</div>
<section ref="content" class="modal-card-body">
  <div class="columns" v-for="teamStat in teamStatColumns">
    <div class="column is-4 align-right">
      <div class="control">
        <div class="tags has-addons">
          <span class="tag" v-if="teamStat.teamOneStatRank">{{ teamStat.teamOneStatRank }}</span>
          <span
            class="tag" v-bind:class="teamStatClass(teamStat.teamOneStatRank, teamStat.teamTwoStatRank)">
            {{ teamStat.teamOneStat }}
          </span>
        </div>
      </div>
    </div>
    <div class="column is-4 align-center">
      <div class="control">
        <div class="tags">
          <b-tooltip :label="teamStat.statDesc"
            :active="tooltipActive" animated type="is-success">
            <span class="tag">{{ teamStat.statAbbrev }}</span>
          </b-tooltip>
        </div>
      </div>
    </div>
    <div class="column is-4 align-left">
      <div class="control">
        <div class="tags has-addons">
          <span
            class="tag" v-bind:class="teamStatClass(teamStat.teamTwoStatRank, teamStat.teamOneStatRank)">
            {{ teamStat.teamTwoStat }}
          </span>
          <span class="tag" v-if="teamStat.teamTwoStatRank">{{ teamStat.teamTwoStatRank }}</span>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="modal-card-foot">
  <button class="button" type="button" @click="closeModal()">Close</button>
</div>
</div>

teamStatColumns() {
  return this.statColumns.map(s => {
    const teamOneStat = this.selectedTeamOne[s];
    const teamOneStatRank = this.selectedTeamOne[s + "Rank"]
      ? this.selectedTeamOne[s + "Rank"]
      : "";
    const teamTwoStat = this.selectedTeamTwo[s];
    const teamTwoStatRank = this.selectedTeamTwo[s + "Rank"]
      ? this.selectedTeamTwo[s + "Rank"]
      : "";
    const statAbbrev = this.statColumnDesc[s].abbrev;
    const statDesc = this.statColumnDesc[s].desc;
    return {
      statName: s,
      statAbbrev,
      statDesc,
      teamOneStat,
      teamOneStatRank,
      teamTwoStat,
      teamTwoStatRank
    };
  });
}

sortedTeamRatings() {
  return this.$store.state.teamRatings.sort((a, b) => {
    const teamA = a.team.toUpperCase();
    const teamB = b.team.toUpperCase();

    if (teamA > teamB) {
      return 1;
    } else if (teamA < teamB) {
      return -1;
    }
    return 0;
  });
}

selectTeam(team, type) {
  console.log(team);
  this.$store.commit("setTeamSelected", { team: team, type: type });
},


statColumnDesc: {
  rank: {
    "abbrev": "KenPom",
    "desc": "KenPom Rank"
  },
  record: {
    "abbrev": "Record",
    "desc": "Win-Loss Record"
  },
  conf: {
    "abbrev": "Conference",
    "desc": "Conference Affiliation"
  },
  adjEM: {
    "abbrev": "Efficiency Margin",
    "desc": "Adjusted Efficiency Margin"
  },
  adjO: {
    "abbrev": "Offensive Efficiency",
    "desc": "Adjusted Offensive Efficiency: Points scored per 100 possessions (adjusted for opponent)"
  },
  adjD: {
    "abbrev": "Defensive Efficiency",
    "desc": "Adjusted Defensive Efficiency: Points allowed per 100 possessions (adjusted for opponent)"
  },
  adjT: {
    "abbrev": "Tempo",
    "desc": "Adjusted Tempo: Possessions per 40 minutes (adjusted for opponent)"
  },
  luck: {
    "abbrev": "Luck",
    "desc": "Luck Rating"
  },
  sosAdjEM: {
    "abbrev": "SoS Rating",
    "desc": "Strength of Schedule Rating"
  },
  sosOppO: {
    "abbrev": "SoS Offensive Efficiency",
    "desc": "Average Adjusted Offensive Efficiency of Opposing Offenses"
  },
  sosOppD: {
    "abbrev": "SoS Defensive Efficiency",
    "desc": "Average Adjusted Defensive Efficiency of Opposing Defenses"
  },
  nonConfAdjEM: {
    "abbrev": "Non-Conf SoS",
    "desc": "Non-Conference Strength of Schedule Rating"
  }
}
}



<%
/* for scraping */

teams = BKCTeamApplication.getTeamsByGroup(50);

'['

foreach (t in teams) {

'{'
'id:' t.teamId ','
'location:' '"' t.location '"' ','
'name:' '"' t.name '"' ','
'abbrev:' '"'  t.abbrev'"' ','
'nickname:' '"' t.teamNickname '"'
'},'

}

']'

%>
