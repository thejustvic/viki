import {UserImage} from '@/components/common/user-image'
import {observer} from 'mobx-react-lite'
import {useChatStore} from '../chat-store'
import {Profile} from '../types'

export const ReactionsUsersCount = observer(
  ({
    filterIds,
    userIds
  }: {
    filterIds: Set<string>
    userIds: string[] | undefined
  }) => {
    const [state] = useChatStore()

    const usersWhoReactedLength = filterIds.size

    if (usersWhoReactedLength === 1) {
      return (
        <ReactionsFirstUser
          user={state.usersWhoReacted.find(e => e.id === userIds?.[0])}
        />
      )
    }

    return (
      <span
        className="text-sm text-base-content truncate max-w-[30px]"
        title={String(usersWhoReactedLength)}
      >
        {usersWhoReactedLength}
      </span>
    )
  }
)

const ReactionsFirstUser = ({user}: {user: Profile | undefined}) => {
  return (
    <UserImage
      src={user?.avatar_url ?? undefined}
      containerClassName="h-[20px] w-[20px]"
    />
  )
}
