import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {Util} from '@/utils/util'
import {makeAutoObservable, observable} from 'mobx'
import {Team, TeamMember, TeamWithMembers} from './types'

interface State {
  myTeams: SupabaseQuery<Team[]>
  memberTeams: SupabaseQuery<Team[]>
  currentTeam: SupabaseQuery<TeamWithMembers>
  currentTeamId: TeamWithMembers['id'] | null
}

export class TeamStore {
  state: State = {
    currentTeam: {
      loading: false,
      data: null,
      error: null
    },
    myTeams: {
      loading: false,
      data: null,
      error: null
    },
    memberTeams: {
      loading: false,
      data: null,
      error: null
    },
    currentTeamId: null
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.shallow
    })
  }

  setCurrentTeam(team: State['currentTeam']): void {
    if (team.data?.id) {
      this.setCurrentTeamId(team.data.id)
    }

    this.state.currentTeam = team
  }

  setCurrentTeamId(id: string): void {
    this.state.currentTeamId = id
  }

  setMyTeams(teams: State['myTeams']): void {
    if (teams.data?.[0].id) {
      this.setCurrentTeamId(teams.data[0].id)
    }
    this.state.myTeams = teams
  }

  setMemberTeams(teams: State['memberTeams']): void {
    this.state.memberTeams = teams
  }

  handleUpdate = (
    oldTeamMember: TeamMember,
    newTeamMember: TeamMember
  ): void => {
    if (!this.state.currentTeam.data) {
      return
    }
    const {team_members, ...teamData} = this.state.currentTeam.data
    const teamMembers = team_members.map(teamMember => {
      if (teamMember.id === oldTeamMember.id) {
        return newTeamMember
      }
      return teamMember
    })
    if (teamMembers) {
      this.setCurrentTeam({
        ...this.state.currentTeam,
        data: {...teamData, team_members: teamMembers}
      })
    }
  }

  handleInsert = (newTeamMember: TeamMember): void => {
    if (this.state.currentTeam.data) {
      const {team_members, ...teamData} = this.state.currentTeam.data
      this.setCurrentTeam({
        ...this.state.currentTeam,
        data: {...teamData, team_members: [...team_members, newTeamMember]}
      })
    }
  }

  handleDelete = (oldTeamMember: TeamMember): void => {
    if (!this.state.currentTeam.data) {
      return
    }
    const team_members = Util.clone(this.state.currentTeam.data.team_members)
    if (team_members) {
      this.setCurrentTeam({
        ...this.state.currentTeam,
        data: {
          ...this.state.currentTeam.data,
          team_members: team_members.filter(
            teamMember => teamMember.id !== oldTeamMember.id
          )
        }
      })
    }
  }
}

const [TeamContext, useTeamStore] = createUseStore<TeamStore>()
export {TeamContext, useTeamStore}
