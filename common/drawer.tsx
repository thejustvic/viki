import Link from 'next/link'
import {Button, CodeMockup, Divider, Menu} from 'react-daisyui'
import tw from 'tailwind-styled-components'

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

export default function Drawer({toggleDrawer}: Props) {
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
    </TwMenu>
  )
}
