import {Dropdown} from '@/components/daisyui/dropdown'
import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import {useChatStore} from '../chat-store'
import {Message} from '../types'
import {ReactionsSmileyText} from './reactions-smiley-text'
import {ReactionsUsersCount} from './reactions-users-count'
import {ReactionsUsersList} from './reactions-users-list'
import {useReactionsHandlers} from './use-reactions-handlers'

export const ReactionsSmileyList = observer(({message}: {message: Message}) => {
  const [state] = useChatStore()

  const {selectReaction} = useReactionsHandlers()

  return ObjUtil.list(message.reactions, (smiley, userIds) => {
    // Create a Set of IDs from the reaction.usersWhoReacted for fast lookup
    const filterIds = new Set(userIds)

    // Filter usersWhoReacted, keeping only elements in reactions userIds
    const filteredUsers = state.usersWhoReacted.filter(item =>
      filterIds.has(item.id)
    )

    return (
      <div key={smiley} onClick={() => selectReaction(smiley, message)}>
        <Dropdown hover={!isMobile}>
          <ReactionsSmileyWrapper filterIds={filterIds}>
            <ReactionsSmileyText value={smiley} className="text-[16px]" />
            <ReactionsUsersCount filterIds={filterIds} userIds={userIds} />
          </ReactionsSmileyWrapper>
          <Dropdown.Menu>
            <ReactionsUsersList users={filteredUsers} />
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
