import {IconSquareRoundedPlus} from '@tabler/icons-react'
import Link from 'next/link'
import {Button} from 'react-daisyui'
import tw from 'tailwind-styled-components'

const TwAdd = tw(Button)`
  bg-base-300 
  shadow-md 
  border-0 
  rounded-2xl
  w-[288px]
  h-[142px]
  md:w-[190px]
`

export const AddNewPost = () => {
  const href = `/?create-post=true`

  return (
    <Link href={href}>
      <TwAdd>
        <IconSquareRoundedPlus size={48} />
      </TwAdd>
    </Link>
  )
}
