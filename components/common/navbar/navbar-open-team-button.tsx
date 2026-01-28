import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconUsersGroup} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

export const NavbarOpenTeamButton = observer(() => {
  const {user} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const handleOpenTeam = () => {
    updateSearchParams('team', 'true')
  }

  if (user?.is_anonymous) {
    return null
  }

  return (
    <Button shape="circle" onClick={handleOpenTeam}>
      <IconUsersGroup />
    </Button>
  )
})
