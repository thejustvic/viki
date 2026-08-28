/* eslint-disable max-lines-per-function */
import {useBoolean} from '@/hooks/use-boolean'
import {useEffect, useRef, useState} from 'react'
import tw from '../common/tw-styled-components'
import {CanopyParams} from './canopy-config'
import {CanopyScene} from './canopy-scene'

const TwCanopyWrapper = tw.div`
  flex
  w-screen
  h-screen
  relative
`

const TwCanopyLoading = tw.div`
  absolute
  top-0
  left-0
  w-full
  h-full
  bg-base-100/95
  text-base-content
  flex
  justify-center
  items-center
  z-10
  text-lg
`

const TwCanopyConfigurator = tw.div`
  w-[300px]
  p-4
  bg-base
  text-base-content
`

const TwCanopyConfiguratorItem = tw.div`
  mb-2
`

const TwRange = tw.input`
  range
  w-full
  mt-3
`

const TwCanopyConfiguratorInfo = tw.div`
  text-xs
  mt-4
  text-base-content/50
`

export const CanopyConfigurator = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<CanopyScene | null>(null)
  const isLoaded = useBoolean(false)

  const [params, setParams] = useState<CanopyParams>({
    width: 3.0,
    height: 2.2,
    depth: 5.0
  })

  useEffect(() => {
    if (containerRef.current && !sceneRef.current) {
      sceneRef.current = new CanopyScene(containerRef.current, () => {
        isLoaded.turnOn()
      })
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.destroy()
        sceneRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (sceneRef.current && isLoaded.value) {
      sceneRef.current.update(params)
    }
  }, [params, isLoaded.value])

  const handleChange = (key: keyof CanopyParams, value: number) => {
    if (Number.isNaN(value)) {
      return
    }
    setParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const safeWidth = Number.isNaN(params.width) ? 3.0 : params.width
  const safeHeight = Number.isNaN(params.height) ? 2.2 : params.height
  const safeDepth = Number.isNaN(params.depth) ? 5.0 : params.depth

  return (
    <TwCanopyWrapper>
      {!isLoaded.value && (
        <TwCanopyLoading>Завантаження 3D-моделей навісу...</TwCanopyLoading>
      )}

      <TwCanopyConfigurator>
        <h3 className="mb-8">Конфігуратор навісу</h3>

        <TwCanopyConfiguratorItem>
          <label>Ширина: {safeWidth.toFixed(2)} м</label>
          <TwRange
            type="range"
            min="2.0"
            max="8.0"
            step="0.05"
            value={safeWidth}
            onChange={e => handleChange('width', parseFloat(e.target.value))}
          />
        </TwCanopyConfiguratorItem>

        <TwCanopyConfiguratorItem>
          <label>Висота: {safeHeight.toFixed(2)} м</label>
          <TwRange
            type="range"
            min="2.0"
            max="8.0"
            step="0.05"
            value={safeHeight}
            onChange={e => handleChange('height', parseFloat(e.target.value))}
          />
        </TwCanopyConfiguratorItem>

        <TwCanopyConfiguratorItem>
          <label>Глибина: {safeDepth.toFixed(2)} м</label>
          <TwRange
            type="range"
            min="2.0"
            max="8.0"
            step="0.05"
            value={safeDepth}
            onChange={e => handleChange('depth', parseFloat(e.target.value))}
          />
        </TwCanopyConfiguratorItem>

        <TwCanopyConfiguratorInfo>
          * Мінімальне значення: 2 м<br />* Максимальне значення: 8 м
        </TwCanopyConfiguratorInfo>
      </TwCanopyConfigurator>

      <div ref={containerRef} className="grow h-full overflow-hidden" />
    </TwCanopyWrapper>
  )
}
