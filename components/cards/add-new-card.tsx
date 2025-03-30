import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {IconSquareRoundedPlus} from '@tabler/icons-react'

import tw from 'tailwind-styled-components'

const TwAdd = tw(Button)`
  bg-base-300 
  shadow-md 
  border-0
  rounded-2xl
  w-[288px]
  h-[142px]
  md:w-[190px]
  text-primary
`

export const AddNewCard = () => {
  return <ParallaxCardContainer cardNodeBody={<CardBody />} my />
}

const CardBody = () => {
  const updateSearchParams = useUpdateSearchParams()
  const onClickHandler = () => {
    updateSearchParams('create-card', 'true')
  }

  return (
    <TwAdd onClick={onClickHandler}>
      <IconSquareRoundedPlus size={48} />
    </TwAdd>
  )
}
