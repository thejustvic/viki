'use client'

import {KeenSliderPlugin, useKeenSlider} from 'keen-slider/react'
import Image from 'next/image'
import {CSSProperties} from 'react'
import {Button, Link} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import './style.scss'

const TwCard = tw.div`
  p-4
  bg-base-300 
  shadow-2xl
  rounded-2xl
  h-[142px]
  w-[190px]
  carousel__cell
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

export const TechStackCarousel = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: '.carousel__cell',
      renderMode: 'custom',
      mode: 'free-snap'
    },
    [carousel]
  )

  const preserve3D: CSSProperties = {
    transformStyle: 'preserve-3d'
  }
  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  return (
    <div className="flex items-center justify-center flex-1">
      <div className="scene">
        <h1 className="flex justify-center mb-8 font-mono text-2xl drop-shadow-2xl">
          Tech Stack
        </h1>
        <div className="carousel keen-slider" ref={sliderRef}>
          {stack.map(e => (
            <TwCard style={preserve3D}>
              <div style={transform} className="flex flex-col h-full">
                <div className="flex items-center justify-center flex-1">
                  <Image height={58} width={58} src={e.logo} alt="logo" />
                </div>
                <div className="flex items-center justify-center">
                  <Link href={e.href} rel="noopener noreferrer" target="_blank">
                    <Button color="primary" variant="outline" size="xs">
                      {e.name}
                    </Button>
                  </Link>
                </div>
              </div>
            </TwCard>
          ))}
        </div>
      </div>
    </div>
  )
}

const stack = [
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
