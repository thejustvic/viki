import {UserImage} from '@/components/common/user-image'
import {Dropdown} from '@/components/daisyui/dropdown'
import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconMoodSmile, IconMoodSmileFilled} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {HTMLProps, useEffect, useState} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {Message, Profile, smileys, UserWhoReacted} from '../types'
import {getReactions} from './smiley-reactions-utils'
import {useReactionsHandlers} from './use-reactions-handlers'

const TwSmileyContainer = tw.div`
  bg-accent-content
  rounded-box
  px-1
  grid
  gap-px
  grid-cols-[repeat(3,1fr)]
`

const TwSmiley = tw.div`
  px-1 
  cursor-pointer 
`

const TwIconReaction = tw.div`
  cursor-pointer
`

const TwIconReactionAbsoluteContainer = tw(TwIconReaction)`
  absolute
  bottom-4
  -left-2
`

const TwIconReactionAbsolute = tw.div`
  absolute
`

const TwContainer = tw.div`
  relative
  flex
  flex-wrap
  gap-1
  items-center
`

const TwUsers = tw.div`
  flex
  flex-col
  gap-2
  bg-info-content
  p-2
  rounded-box
`

const TwDropdown = tw(Dropdown)`
  absolute 
  bottom-0 
  left-0 
  opacity-0 
  hover:opacity-100 
  transition-opacity 
  ease-in-out 
  duration-150
`

interface SmileyReactionsProps {
  message: Message
  isMouseOver: boolean
}

export const SmileyReactions = ({
  message,
  isMouseOver
}: SmileyReactionsProps) => {
  if (ObjUtil.isEmpty(message.reactions)) {
    return <EmptyReactions message={message} isMouseOver={isMouseOver} />
  }
  if (ObjUtil.isEmpty(message.reactions)) {
    return
  }
  return <Reactions message={message} />
}

const maxShownUsers = 3

const useUsersWhoReacted = (usersWhoReact: UserWhoReacted[]) => {
  const {supabase} = useSupabase()
  const [users, setUsers] = useState<Profile[]>([])

  useEffect(() => {
    const users = usersWhoReact
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(el => el.user_id)

    void (async (): Promise<void> => {
      const {data} = await supabase.from('profiles').select().in('id', users)
      if (data) {
        setUsers(data)
      }
    })()
  }, [usersWhoReact])

  return users
}

const UsersWhoReacted = observer(
  ({usersWhoReact}: {usersWhoReact: UserWhoReacted[]}) => {
    const users = useUsersWhoReacted(usersWhoReact)

    return (
      <TwUsers>
        {users.slice(0, maxShownUsers).map(user => {
          return (
            <div className="flex items-center gap-4" key={user.id}>
              <UserImage
                src={user.avatar_url ?? undefined}
                containerClassName="h-[24px] w-[24px]"
              />
              <div className="truncate">{user.full_name}</div>
            </div>
          )
        })}
        {users.length > maxShownUsers &&
          `... and ${users.length - maxShownUsers} more`}
      </TwUsers>
    )
  }
)

const EmptyReactions = ({message, isMouseOver}: SmileyReactionsProps) => {
  return (
    <TwDropdown
      className={twJoin(isMouseOver && 'opacity-100')}
      hover={!isMobile}
    >
      <TwIconReactionAbsoluteContainer
        tabIndex={isMobile ? 0 : undefined}
        role={isMobile ? 'button' : ''}
      >
        <TwIconReactionAbsolute>
          <IconMoodSmileFilled size={24} />
        </TwIconReactionAbsolute>
      </TwIconReactionAbsoluteContainer>
      <Dropdown.Menu
        className="-top-6 -left-4"
        tabIndex={isMobile ? 0 : undefined}
      >
        <DropdownContent message={message} />
      </Dropdown.Menu>
    </TwDropdown>
  )
}

const Reactions = (props: {message: Message}) => {
  return (
    <TwContainer>
      <ReactionsList {...props} />
      <ReactionsDropdown {...props} />
    </TwContainer>
  )
}

const ReactionsDropdown = ({message}: {message: Message}) => {
  return (
    <Dropdown hover={!isMobile}>
      <TwIconReaction
        className={twJoin('flex items-center')}
        tabIndex={isMobile ? 0 : undefined}
        role={isMobile ? 'button' : ''}
      >
        <IconMoodSmile size={24} />
      </TwIconReaction>
      <Dropdown.Menu
        className="-top-2 -left-2"
        tabIndex={isMobile ? 0 : undefined}
      >
        <DropdownContent message={message} />
      </Dropdown.Menu>
    </Dropdown>
  )
}

const ReactionsList = observer(({message}: {message: Message}) => {
  const {user} = useSupabase()
  const {selectReaction} = useReactionsHandlers()

  return getReactions(message).map(reaction => {
    const isUsersWhoReactedHasCurrentUserId = reaction.usersWhoReacted.some(
      e => e.user_id === user?.id
    )
    const usersWhoReactedLength = reaction.usersWhoReacted.length
    return (
      <div
        key={reaction.smiley}
        onClick={() => selectReaction(reaction.smiley, message)}
      >
        <Dropdown hover={!isMobile}>
          <div
            className={twJoin(
              'flex gap-1 px-2 rounded-box items-center cursor-pointer',
              isUsersWhoReactedHasCurrentUserId
                ? 'bg-accent-content'
                : 'bg-info-content'
            )}
          >
            <SmileyText value={reaction.smiley} className="text-[16px]" />
            {usersWhoReactedLength > 1 ? (
              <span
                className="text-sm truncate max-w-[30px] text-info"
                title={String(usersWhoReactedLength)}
              >
                {usersWhoReactedLength}
              </span>
            ) : null}
          </div>
          <Dropdown.Menu>
            <UsersWhoReacted usersWhoReact={reaction.usersWhoReacted} />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  })
})

const DropdownContent = ({message}: {message: Message}) => {
  const {selectReaction} = useReactionsHandlers()

  return (
    <TwSmileyContainer>
      {smileys.map(smiley => {
        return (
          <TwSmiley
            onClick={() => selectReaction(smiley, message)}
            key={smiley}
          >
            <SmileyText value={smiley} className="text-[16px]" />
          </TwSmiley>
        )
      })}
    </TwSmileyContainer>
  )
}

const SmileyText = ({
  value,
  className
}: {
  value: string
  className?: HTMLProps<HTMLElement>['className']
}) => {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{
        __html: value
      }}
    />
  )
}
