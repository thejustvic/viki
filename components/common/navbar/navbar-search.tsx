import {useCardsStore} from '@/components/cards/cards-store'
import {Button} from '@/components/daisyui/button'
import {Input} from '@/components/daisyui/input'
import {useBoolean} from '@/hooks/use-boolean'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSearch} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useId} from 'react'

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
      <Button
        onClick={open.turnOn}
        className="w-full border-base-content/10"
        size="sm"
        soft
      >
        <div className="text-base-content/30 flex gap-2 items-center ">
          <IconSearch />
          Search
        </div>
      </Button>
    )
  }
  return (
    <div className="flex flex-col relative w-full" onBlur={open.turnOff}>
      <div className="absolute left-2 top-2 z-10">
        <IconSearch size={16} />
      </div>
      <Input
        inputClassName="px-8 w-full input-sm focus:outline-none focus:border-info/50"
        placeholder="Search cards by name"
        type="search"
        name={id}
        autoFocus
        onChange={e => store.setSearchValue(e.target.value)}
        value={state.searchValue}
      />
      <div className="absolute bottom-0 left-0 right-0">
        <CardsList />
      </div>
    </div>
  )
})

const CardsList = observer(() => {
  const [, store] = useCardsStore()
  const cards = store.searchedCards()
  const updateSearchParams = useUpdateSearchParams()

  return (
    <div className="h-auto max-h-[250px] overflow-y-auto absolute w-full bg-info-content/75 rounded-b-lg">
      <div className="flex flex-col cursor-pointer">
        {cards.map(card => (
          <div
            key={card.id}
            className="truncate text-base-content/70 text-sm px-8 py-1 hover:bg-info/50"
            onMouseDown={() => {
              updateSearchParams('card', card.id)
            }}
          >
            {card.text}
          </div>
        ))}
      </div>
    </div>
  )
})
