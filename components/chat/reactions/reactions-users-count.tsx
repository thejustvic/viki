import {useChatStore} from '@/components/chat/chat-store'
import {Profile} from '@/components/chat/types'
import tw from '@/components/common/tw-styled-components'
import {UserImage} from '@/components/common/user-image'
import {observer} from 'mobx-react-lite'

const TwWrapper = tw.span`
  text-sm
  text-base-content/80
  truncate
  max-w-[30px]
`

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
          user={state.usersWhoReacted.data?.find(e => e.id === userIds?.[0])}
        />
      )
    }

    return (
      <TwWrapper title={String(usersWhoReactedLength)}>
        {usersWhoReactedLength}
      </TwWrapper>
    )
  }
)

const ReactionsFirstUser = ({user}: {user: Profile | undefined}) => {
  return (
    <UserImage
      src={user?.avatar_url ?? undefined}
      containerClassName="h-[20px] w-[20px] shadow-none"
    />
  )
}
