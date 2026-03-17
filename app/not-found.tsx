'use client'

import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {motion} from 'framer-motion'
import Link from 'next/link'

const TwNotFound = tw.div`
  flex
  flex-col
  items-center
  justify-center
  h-screen
  text-center
`

const TwMotionH1 = tw(motion.h1)`
  text-6xl
  font-bold
`

const TwMotionP = tw(motion.p)`
  mt-4
  text-xl
  text-gray-600
`

const TwMotionDiv = tw(motion.div)`
  mt-6
`

export default function NotFoundPage() {
  return (
    <TwNotFound>
      <TwMotionH1
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
      >
        404
      </TwMotionH1>
      <TwMotionP
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.3}}
      >
        Oops! The page you are looking for does not exist.
      </TwMotionP>
      <TwMotionDiv
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.6}}
      >
        <Button soft color="info">
          <Link href="/cards">Go Home</Link>
        </Button>
      </TwMotionDiv>
    </TwNotFound>
  )
}
