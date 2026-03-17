import {useCardsStore} from '@/components/cards/cards-store'
import {Button} from '@/components/daisyui/button'
import {Input} from '@/components/daisyui/input'
import {useBoolean} from '@/hooks/use-boolean'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSearch} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useId} from 'react'
import tw from '../tw-styled-components'

const TwButton = tw(Button)`
  w-full
  border-base-content/10
`

const TwSearch = tw.div`
  text-base-content/30
  flex
  gap-2
  items-center
`

const TwWrapper = tw.div`
  flex
  flex-col
  relative
  w-full
`

const TwIconSearchWrap = tw.div`
  absolute
  left-2
  top-2
  z-10
`

const TwInput = tw(Input)`
  px-8
  w-full
  input-sm
  focus:outline-none
  focus:border-info/50
`

const TwCardsList = tw.div`
  absolute
  bottom-0
  left-0
  right-0
`

export const NavbarSearch = observer(() => {
  const open = useBoolean(false)
  const [state, store] = useCardsStore()
  const id = useId()

  useGlobalKeyDown({
    handlers: {
      escape: open.turnOff
    },
    id,
    active: open.value
  })

  if (!open.value) {
    return (
      <TwButton onClick={open.turnOn} size="sm" soft>
        <TwSearch>
          <IconSearch />
          Search
        </TwSearch>
      </TwButton>
    )
  }
  return (
    <TwWrapper onBlur={open.turnOff}>
      <TwIconSearchWrap>
        <IconSearch size={16} />
      </TwIconSearchWrap>
      <TwInput
        placeholder="Search cards by name"
        type="search"
        name={id}
        autoFocus
        onChange={e => store.setSearchValue(e.target.value)}
        value={state.searchValue}
      />
      <TwCardsList>
        <CardsList />
      </TwCardsList>
    </TwWrapper>
  )
})

const TwCardsListWrapper = tw.div`
  h-auto
  max-h-[250px]
  overflow-y-auto
  absolute
  w-full
  bg-info-content/75
  rounded-b-lg
`

const TwCards = tw.div`
  flex
  flex-col
  cursor-pointer
`

const TwCard = tw.div`
  truncate
  text-base-content/70
  text-sm
  px-8
  py-1
  hover:bg-info/50
`

const CardsList = observer(() => {
  const [, store] = useCardsStore()
  const cards = store.searchedCards()
  const updateSearchParams = useUpdateSearchParams()

  return (
    <TwCardsListWrapper>
      <TwCards>
        {cards.map(card => (
          <TwCard
            key={card.id}
            onMouseDown={() => {
              updateSearchParams('card', card.id)
            }}
          >
            {card.text}
          </TwCard>
        ))}
      </TwCards>
    </TwCardsListWrapper>
  )
})
