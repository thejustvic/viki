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

  constructor(serverCurrentTeamId: string | null | undefined) {
    makeAutoObservable(this, {
      state: observable.shallow
    })
    if (serverCurrentTeamId) {
      this.setCurrentTeamId(serverCurrentTeamId)
    }
  }

  clear = (): void => {
    this.state.currentTeam = {
      loading: false,
      data: null,
      error: null
    }
    this.state.myTeams = {
      loading: false,
      data: null,
      error: null
    }
    this.state.memberTeams = {
      loading: false,
      data: null,
      error: null
    }
    this.state.currentTeamId = null
  }

  setMyTeams(teams: State['myTeams']): void {
    this.state.myTeams = teams
  }

  handleUpdateTeam = (oldTeam: Team, newTeam: Team): void => {
    if (!this.state.myTeams.data) {
      return
    }
    const teams = this.state.myTeams.data.map(team => {
      if (team.id === oldTeam.id) {
        return newTeam
      }
      return team
    })
    if (teams) {
      this.setMyTeams({
        ...this.state.myTeams,
        data: teams
      })
    }
  }

  handleInsertTeam = (newTeam: Team): void => {
    if (this.state.myTeams.data) {
      this.setMyTeams({
        ...this.state.myTeams,
        data: [...this.state.myTeams.data, newTeam]
      })
    }
  }

  handleDeleteTeam = (oldTeam: Team): void => {
    const teams = Util.clone(this.state.myTeams.data)
    if (teams) {
      this.setMyTeams({
        ...this.state.myTeams,
        data: teams.filter(teamMember => teamMember.id !== oldTeam.id)
      })
    }
  }

  setMemberTeams(teams: State['memberTeams']): void {
    this.state.memberTeams = teams
  }

  handleUpdateTeamMember = (
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

  handleInsertTeamMember = (newTeamMember: TeamMember): void => {
    if (this.state.currentTeam.data) {
      const {team_members, ...teamData} = this.state.currentTeam.data
      this.setCurrentTeam({
        ...this.state.currentTeam,
        data: {...teamData, team_members: [...team_members, newTeamMember]}
      })
    }
  }

  handleDeleteTeamMember = (oldTeamMember: TeamMember): void => {
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

  setCurrentTeam(team: State['currentTeam']): void {
    this.state.currentTeam = team
  }

  setCurrentTeamId(id: string): void {
    this.state.currentTeamId = id
  }
}

const [TeamContext, useTeamStore] = createUseStore<TeamStore>()
export {TeamContext, useTeamStore}
