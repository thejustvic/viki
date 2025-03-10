import {Tables} from '@/utils/database.types'

export type TeamMember = Tables<'team_members'>
export type Team = Tables<'teams'>

export interface TeamWithMembers extends Team {
  team_members: TeamMember[]
}
