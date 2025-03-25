import {useChatStore} from '@/components/chat/chat-store'
import {ReactionsSmileyText} from '@/components/chat/reactions/reactions-smiley-text'
import {ReactionsUsersCount} from '@/components/chat/reactions/reactions-users-count'
import {ReactionsUsersList} from '@/components/chat/reactions/reactions-users-list'
import {useReactionsHandlers} from '@/components/chat/reactions/use-reactions-handlers'
import {Message} from '@/components/chat/types'
import {Dropdown} from '@/components/daisyui/dropdown'
import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'

export const ReactionsSmileyList = observer(({message}: {message: Message}) => {
  const [state] = useChatStore()

  const {selectReaction} = useReactionsHandlers()

  return ObjUtil.list(message.reactions, (smiley, userIds) => {
    // Create a Set of IDs from the reaction.usersWhoReacted for fast lookup
    const filterIds = new Set(userIds)

    // Filter usersWhoReacted, keeping only elements in reactions userIds
    const filteredUsers = state.usersWhoReacted.data?.filter(item =>
      filterIds.has(item.id)
    )

    return (
      <div
        key={smiley}
        onClick={e => {
          e.stopPropagation()
          selectReaction(smiley, message)
        }}
        onTouchStart={e => e.stopPropagation()}
      >
        <Dropdown hover={!isMobile}>
          <ReactionsSmileyWrapper filterIds={filterIds}>
            <ReactionsSmileyText value={smiley} className="text-[16px]" />
            <ReactionsUsersCount filterIds={filterIds} userIds={userIds} />
          </ReactionsSmileyWrapper>
          <Dropdown.Menu>
            <ReactionsUsersList users={filteredUsers ?? []} />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  })
})

interface ReactionsSmileyWrapperProps extends PropsWithChildren {
  filterIds: Set<string>
}

const ReactionsSmileyWrapper = observer(
  ({filterIds, children}: ReactionsSmileyWrapperProps) => {
    const {user} = useSupabase()
    const userId = user?.id
    const isUsersWhoReactedHasCurrentUserId = userId
      ? filterIds.has(userId)
      : false
    return (
      <div
        className={twJoin(
          'flex gap-1 px-2 rounded-box items-center cursor-pointer',
          isUsersWhoReactedHasCurrentUserId ? 'bg-info' : 'bg-info-content'
        )}
      >
        {children}
      </div>
    )
  }
)
