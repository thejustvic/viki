import {Profile} from '@/components/chat/types'
import {UserImage} from '@/components/common/user-image'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'

const TwUsers = tw.div`
  flex
  flex-col
  gap-2
  bg-info-content
  p-2
  rounded-box
`

const maxShownUsers = 3

export const ReactionsUsersList = observer(({users}: {users: Profile[]}) => {
  return (
    <TwUsers>
      {users.slice(0, maxShownUsers).map(user => {
        return (
          <div className="flex items-center gap-2" key={user.id}>
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
})
