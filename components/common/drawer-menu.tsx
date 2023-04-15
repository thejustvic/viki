import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {Button, CodeMockup, Divider, Menu} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {useGlobalStore} from '../global/global-store'

const TwMenu = tw(Menu)<{$margin: boolean}>`
  bg-base-100 
  text-base-content 
  overflow-y-auto 
  w-80 
  p-2
  ${p => (p.$margin ? 'my-8 ml-2 rounded-lg' : '')}
`

export const DrawerMenu = observer(() => {
  const [state, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setDrawerClosed()
  }

  return (
    <TwMenu vertical $margin={state.drawerOpenByHover}>
      <Link href="/">
        <Button color="ghost" className="w-full text-xl" onClick={closeDrawer}>
          viki
        </Button>
      </Link>
      <Divider />
      <CodeMockup>
        <CodeMockup.Line>pnpm i viki@0.0.1</CodeMockup.Line>
        <CodeMockup.Line>installing...</CodeMockup.Line>
        <CodeMockup.Line status="success">Profit!</CodeMockup.Line>
      </CodeMockup>
    </TwMenu>
  )
})
