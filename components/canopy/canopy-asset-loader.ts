import * as THREE from 'three'
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {CANOPY_CONFIG} from './canopy-config'

export class CanopyAssetLoader {
  private loader = new GLTFLoader()

  private loadGLTF(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.loader.load(url, resolve, undefined, reject)
    })
  }

  public async loadAssets(
    isDestroyedCheck: () => boolean
  ): Promise<Record<string, THREE.Object3D>> {
    const [modelsGltf, materialsGltf] = await Promise.all([
      this.loadGLTF(CANOPY_CONFIG.ASSET_PATH_MODELS),
      this.loadGLTF(CANOPY_CONFIG.ASSET_PATH_MATERIALS)
    ])

    const templates: Record<string, THREE.Object3D> = {}
    if (isDestroyedCheck()) {
      return templates
    }

    const materialsRegistry: Record<string, THREE.MeshStandardMaterial> = {}
    materialsGltf.scene.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material && !Array.isArray(mesh.material)) {
          materialsRegistry[mesh.material.name] =
            mesh.material as THREE.MeshStandardMaterial
        }
      }
    })

    for (const name of CANOPY_CONFIG.MESH_NAMES) {
      const rawObj = modelsGltf.scene.getObjectByName(name)
      if (rawObj) {
        const isolatedClone = rawObj.clone(true)
        isolatedClone.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (
              mesh.material &&
              !Array.isArray(mesh.material) &&
              materialsRegistry[mesh.material.name]
            ) {
              mesh.material = materialsRegistry[mesh.material.name]
            }
            mesh.castShadow = true
            mesh.receiveShadow = true
          }
        })
        templates[name] = isolatedClone
      }
    }

    return templates
  }
}
