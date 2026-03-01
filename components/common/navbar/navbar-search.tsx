import {useCardsStore} from '@/components/cards/cards-store'
import {Button} from '@/components/daisyui/button'
import {Input} from '@/components/daisyui/input'
import {useBoolean} from '@/hooks/use-boolean'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSearch} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useId} from 'react'
import {SimpleScrollbar} from '../simple-scrollbar'

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
      <Button onClick={open.turnOn} className="w-full" soft size="sm">
        <div className="text-base-content/30 flex gap-2 items-center">
          <IconSearch />
          Search
        </div>
      </Button>
    )
  }
  return (
    <div className="flex flex-col relative w-full" onBlur={open.turnOff}>
      <label className="input input-info border-none w-full input-sm">
        <IconSearch />
        <Input
          autoFocus
          name={id}
          type="search"
          placeholder="Search cards by name"
          onChange={e => store.setSearchValue(e.target.value)}
          value={state.searchValue}
          inputClassName="input-sm"
        />
      </label>
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
    <div className="h-[250px] absolute w-full bg-primary/10 rounded-b-lg">
      <SimpleScrollbar>
        <div className="flex flex-col cursor-pointer">
          {cards.map(card => (
            <div
              className="truncate text-base-content/70 text-sm px-13 py-1 hover:bg-info/50"
              onMouseDown={() => {
                updateSearchParams('card', card.id)
              }}
            >
              {card.text}
            </div>
          ))}
        </div>
      </SimpleScrollbar>
    </div>
  )
})
