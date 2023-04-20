'use client'

import {useBoolean} from '@/hooks/use-boolean'
import {KeenSliderPlugin, useKeenSlider} from 'keen-slider/react'
import Image from 'next/image'
import {CSSProperties} from 'react'
import {Button, Link} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import './style.scss'

const TwCarousel = tw.div`
  flex 
  items-center 
  justify-center 
  flex-1
`

const TwScene = tw.div`
  scene
`

const TwKeenSlider = tw.div`
  carousel 
  keen-slider
`

const TwTechStack = tw.h1`
  flex 
  justify-center 
  mb-8 
  font-mono 
  text-2xl 
  pointer-events-none 
  drop-shadow-2xl
`

const carousel: KeenSliderPlugin = slider => {
  const z = 300
  function rotate() {
    const deg = 360 * slider.track.details.progress
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`
  }
  slider.on('created', () => {
    const deg = 360 / slider.slides.length
    slider.slides.forEach((element, idx) => {
      element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`
    })
    rotate()
  })
  slider.on('detailsChanged', rotate)
}

const animation = {
  duration: 8000,
  easing: (t: number) => t
}

export const TechStackCarousel = () => {
  const mouseOver = useBoolean(false)
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'free-snap',
      created(s) {
        s.container.addEventListener('mouseover', () => {
          mouseOver.setValue(true)
        })
        s.container.addEventListener('mouseout', () => {
          mouseOver.setValue(false)
        })
        s.moveToIdx(5, true, animation)
      },
      updated(s) {
        !mouseOver.value &&
          s.moveToIdx(s.track.details.abs + 5, true, animation)
      },
      animationEnded(s) {
        !mouseOver.value &&
          s.moveToIdx(s.track.details.abs + 5, true, animation)
      }
    },
    [carousel]
  )

  return (
    <TwCarousel>
      <TwScene>
        <TwTechStack>Tech Stack</TwTechStack>
        <TwKeenSlider ref={sliderRef}>
          {stack.map(card => (
            <Card card={card} key={card.href} />
          ))}
        </TwKeenSlider>
      </TwScene>
    </TwCarousel>
  )
}

const TwCard = tw.div`
  p-4
  bg-base-300 
  shadow-2xl
  rounded-2xl
  h-[142px]
  w-[190px]
  carousel__cell
`

const TwCardInner = tw.div`
  flex 
  flex-col 
  h-full
`

const TwImage = tw.div`
  flex 
  items-center 
  justify-center 
  flex-1
`

const TwLink = tw.div`
  flex 
  items-center 
  justify-center
`

const Card = ({card}: {card: CardProps}) => {
  const preserve3D: CSSProperties = {
    transformStyle: 'preserve-3d'
  }
  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  return (
    <TwCard style={preserve3D}>
      <TwCardInner style={transform}>
        <TwImage>
          <Image height={58} width={58} src={card.logo} alt="logo" />
        </TwImage>
        <TwLink>
          <Link href={card.href} rel="noopener noreferrer" target="_blank">
            <Button color="primary" variant="outline" size="xs">
              {card.name}
            </Button>
          </Link>
        </TwLink>
      </TwCardInner>
    </TwCard>
  )
}

interface CardProps {
  name: string
  logo: string
  href: string
}

const stack: CardProps[] = [
  {
    name: 'Next',
    logo: 'https://cdn.cdnlogo.com/logos/n/80/next-js.svg',
    href: 'https://beta.nextjs.org/docs/getting-started'
  },
  {
    name: 'MobX',
    logo: 'https://static.cdnlogo.com/logos/m/14/mobx.svg',
    href: 'https://mobx.js.org/README.html'
  },
  {
    name: 'Supabase',
    logo: 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg',
    href: 'https://supabase.com/docs'
  },
  {
    name: 'Tailwind',
    logo: 'https://static.cdnlogo.com/logos/t/58/tailwind-css.svg',
    href: 'https://tailwindui.com/documentation'
  },
  {
    name: 'TypeScript',
    logo: 'https://static.cdnlogo.com/logos/t/96/typescript.svg',
    href: 'https://www.typescriptlang.org/'
  },
  {
    name: 'React',
    logo: 'https://static.cdnlogo.com/logos/r/63/react.svg',
    href: 'https://react.dev'
  }
]
