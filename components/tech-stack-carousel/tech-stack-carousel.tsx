'use client'

import {Button} from '@/components/daisyui/button'
import {Link} from '@/components/daisyui/link'
import {useBoolean} from '@/hooks/use-boolean'
import {KeenSliderPlugin, useKeenSlider} from 'keen-slider/react'
import Image from 'next/image'
import {useEffect} from 'react'
import {twJoin} from 'tailwind-merge'
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
  truncate
`
const TwCard = tw.div`
  p-4 
  bg-base-300 
  shadow-2xl 
  rounded-2xl 
  h-[142px] 
  w-[190px] 
  carousel__cell 
  transform-3d
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

// 3D Rotation Logic
const carousel: KeenSliderPlugin = slider => {
  const z = 280
  function rotate() {
    const deg = 360 * slider.track.details.progress
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`
  }

  slider.on('created', () => {
    const deg = 360 / slider.slides.length
    slider.slides.forEach((el, idx) => {
      el.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`
    })
    rotate()
  })

  slider.on('detailsChanged', rotate)
}

// Animation Config
const animation = {duration: 8000, easing: (t: number) => t}

export const TechStackCarousel = () => {
  const mouseOver = useBoolean(false)

  const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'free-snap',
      created(s) {
        s.moveToIdx(5, true, animation)

        s.container.addEventListener('mouseover', () =>
          mouseOver.setValue(true)
        )
        s.container.addEventListener('mouseout', () =>
          mouseOver.setValue(false)
        )
      },
      updated(s) {
        if (!mouseOver.value) {
          s.moveToIdx(s.track.details.abs + 5, true, animation)
        }
      },
      animationEnded(s) {
        if (!mouseOver.value) {
          s.moveToIdx(s.track.details.abs + 5, true, animation)
        }
      }
    },
    [carousel]
  )

  useEffect(() => {
    if (!sliderInstance.current) {
      return
    }

    const container = sliderInstance.current.container

    return () => {
      container.removeEventListener('mouseover', () => mouseOver.setValue(true))
      container.removeEventListener('mouseout', () => mouseOver.setValue(false))
    }
  }, [sliderInstance])

  return (
    <div className="overflow-hidden">
      <TwTechStack>Project Tech Stack</TwTechStack>
      <TwCarousel>
        <TwScene>
          <TwKeenSlider ref={sliderRef}>
            {stack.map(card => (
              <Card key={card.href} card={card} />
            ))}
          </TwKeenSlider>
        </TwScene>
      </TwCarousel>
    </div>
  )
}

const Card = ({card}: {card: CardProps}) => {
  const hovered = useBoolean(false)
  return (
    <TwCard>
      <TwCardInner
        style={{transform: 'translateZ(20px)'}}
        onMouseEnter={hovered.turnOn}
        onMouseLeave={hovered.turnOff}
      >
        <Link
          href={card.href}
          rel="noopener noreferrer"
          target="_blank"
          className="flex flex-col h-full"
        >
          <TwImage>
            <Link href={card.href} rel="noopener noreferrer" target="_blank">
              <Image
                height={58}
                width={58}
                src={card.logo}
                alt={`${card.name} logo`}
              />
            </Link>
          </TwImage>
          <TwLink>
            <Button
              color="primary"
              variant="link"
              size="xl"
              className={twJoin(hovered.value && 'btn-warning')}
            >
              {card.name}
            </Button>
          </TwLink>
        </Link>
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
    name: 'Supabase',
    logo: 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg',
    href: 'https://supabase.com/docs'
  },
  {
    name: 'Tailwind4',
    logo: 'https://static.cdnlogo.com/logos/t/58/tailwind-css.svg',
    href: 'https://tailwindcss.com/blog/tailwindcss-v4'
  },
  {
    name: 'Three',
    logo: '/threejs.svg',
    href: 'https://threejs.org'
  },
  {
    name: 'TypeScript',
    logo: 'https://static.cdnlogo.com/logos/t/96/typescript.svg',
    href: 'https://www.typescriptlang.org/'
  },
  {
    name: 'React19.2',
    logo: 'https://static.cdnlogo.com/logos/r/63/react.svg',
    href: 'https://react.dev'
  },
  {
    name: 'Next16',
    logo: '/nextjs.svg',
    href: 'https://nextjs.org/docs/app/getting-started'
  },
  {
    name: 'MobX',
    logo: 'https://static.cdnlogo.com/logos/m/14/mobx.svg',
    href: 'https://mobx.js.org/README.html'
  }
]
