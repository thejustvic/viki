import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {Button, CodeMockup, Divider, Menu, Toggle} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {useGlobalStore} from './global/global-store'

const TwMenu = tw(Menu)`
  bg-base-100 
  text-base-content 
  overflow-y-auto 
  w-80 
  p-2
`

interface Props {
  toggleDrawer: () => void
}

export const DrawerMenu = observer(({toggleDrawer}: Props) => {
  const [state, store] = useGlobalStore()

  const checked = state.scrollbar === 'overlayscrollbars'
  const onToggle = () => {
    const scrollbar = checked ? 'perfectscrollbar' : 'overlayscrollbars'
    store.setScrollbar(scrollbar)
  }

  return (
    <TwMenu vertical>
      <Link href="/">
        <Button color="ghost" className="text-xl w-full" onClick={toggleDrawer}>
          viki
        </Button>
      </Link>
      <Divider />
      <CodeMockup>
        <CodeMockup.Line>pnpm i viki@0.0.1</CodeMockup.Line>
        <CodeMockup.Line>installing...</CodeMockup.Line>
        <CodeMockup.Line status="success">Profit!</CodeMockup.Line>
      </CodeMockup>
      <div className="flex p-4 gap-4">
        perfectscrollbar <Toggle checked={checked} onChange={onToggle} />{' '}
        overlayscrollbars
      </div>
    </TwMenu>
  )
})
