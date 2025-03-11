import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconUsersGroup} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

export const OpenTeamButton = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const handleOpenTeam = () => {
    updateSearchParams('team', 'true')
  }

  return (
    <Button shape="circle" onClick={handleOpenTeam}>
      <IconUsersGroup />
    </Button>
  )
})
