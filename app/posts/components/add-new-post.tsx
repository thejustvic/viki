import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Util} from '@/utils/util'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

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
  return <ParallaxCardContainer cardNodeBody={<CardBody />} />
}

const CardBody = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const onClickHandler = () => {
    const queryString = Util.addQueryParam(searchParams, 'create-post', 'true')
    Util.routerPushQuery(router, queryString, pathname)
  }

  return (
    <TwAdd onClick={onClickHandler}>
      <IconSquareRoundedPlus size={48} />
    </TwAdd>
  )
}
