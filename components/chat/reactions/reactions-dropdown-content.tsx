import {ReactionsSmileyText} from '@/components/chat/reactions/reactions-smiley-text'
import {useReactionsHandlers} from '@/components/chat/reactions/use-reactions-handlers'
import {Message, Smiley, smileys} from '@/components/chat/types'
import {BooleanHookState} from '@/hooks/use-boolean'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

const TwSmileyContainer = tw.div`
  bg-info-content
  rounded-box
  px-1
  grid
  gap-px
  
`

const TwSmiley = tw.div`
  px-1 
  cursor-pointer 
`

export const ReactionsDropdownContent = ({
  message,
  showChoice,
  noSmilesInMessage = false
}: {
  message: Message
  showChoice: BooleanHookState
  noSmilesInMessage?: boolean
}) => {
  const {selectReaction} = useReactionsHandlers()

  const handleSmile = (smiley: Smiley) => {
    selectReaction(smiley, message)
    showChoice.turnOff()
  }

  return (
    <TwSmileyContainer
      className={twJoin(
        isMobile && noSmilesInMessage
          ? 'grid-cols-[repeat(9,1fr)]'
          : 'grid-cols-[repeat(3,1fr)]'
      )}
    >
      {smileys.map(smiley => {
        return (
          <TwSmiley onClick={() => handleSmile(smiley)} key={smiley}>
            <ReactionsSmileyText value={smiley} className="text-[16px]" />
          </TwSmiley>
        )
      })}
    </TwSmileyContainer>
  )
}
