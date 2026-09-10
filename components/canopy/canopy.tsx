'use client'
import {useEffect, useState} from 'react'
import {CanopyParams} from './canopy-config'
import {CanopyScene} from './canopy-scene'

interface CanopyConfiguratorProps {
  config: CanopyParams
}

export const CanopyCanvas = ({config}: CanopyConfiguratorProps) => {
  // 1. create the object IMMEDIATELY during state initialization (synchronously)
  const [canopyInstance] = useState(() => new CanopyScene())
  const [isReady, setIsReady] = useState(false)

  // 2. effect for asynchronous asset loading
  useEffect(() => {
    let isMounted = true

    void canopyInstance.initContext().then(() => {
      if (isMounted) {
        setIsReady(true) // assets are ready, you can build geometry
      }
    })

    return () => {
      isMounted = false
      // here you can optionally call canopyInstance.dispose() if there is anything to clean up in memory
    }
  }, [canopyInstance])

  // 3. effect for updating geometry when changing config OR when assets are ready
  useEffect(() => {
    if (isReady) {
      canopyInstance.update(config)
    }
  }, [config, isReady, canopyInstance])

  // pass group instance to a primitive. Now React knows exactly when to render it
  return <primitive object={canopyInstance} />
}
