import tw from 'tailwind-styled-components'
import {Message, smileys} from '../types'

import {ReactionsSmileyText} from './reactions-smiley-text'
import {useReactionsHandlers} from './use-reactions-handlers'

const TwSmileyContainer = tw.div`
  bg-info-content
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

export const ReactionsDropdownContent = ({message}: {message: Message}) => {
  const {selectReaction} = useReactionsHandlers()

  return (
    <TwSmileyContainer>
      {smileys.map(smiley => {
        return (
          <TwSmiley
            onClick={() => selectReaction(smiley, message)}
            key={smiley}
          >
            <ReactionsSmileyText value={smiley} className="text-[16px]" />
          </TwSmiley>
        )
      })}
    </TwSmileyContainer>
  )
}
