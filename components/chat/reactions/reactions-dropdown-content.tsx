import {ReactionsSmileyText} from '@/components/chat/reactions/reactions-smiley-text'
import {useReactionsHandlers} from '@/components/chat/reactions/use-reactions-handlers'
import {Message, Smiley, smileys} from '@/components/chat/types'
import tw from '@/components/common/tw-styled-components'
import {BooleanHookState} from '@/hooks/use-boolean'
import {useScrollNear} from '@/hooks/use-scroll-into-nearest'

const TwSmileyContainer = tw.div`
  bg-info/50
  rounded-box
  px-1
  grid
  gap-px
  grid-cols-[repeat(3,1fr)]
`

export const ReactionsDropdownContent = ({
  message,
  showChoice
}: {
  message: Message
  showChoice: BooleanHookState
}) => {
  const {selectReaction} = useReactionsHandlers()
  const {containerRef} = useScrollNear(showChoice.value)

  const handleSmile = (smiley: Smiley) => {
    selectReaction(smiley, message)
    showChoice.turnOff()
  }

  return (
    <TwSmileyContainer ref={containerRef}>
      {smileys.map(smiley => {
        return (
          <div
            className="px-1 cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              handleSmile(smiley)
            }}
            onTouchStart={e => e.stopPropagation()}
            key={smiley}
          >
            <ReactionsSmileyText value={smiley} className="text-[16px]" />
          </div>
        )
      })}
    </TwSmileyContainer>
  )
}
