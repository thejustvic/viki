import {SupabaseQuery} from '@/hooks/use-supabase-fetch'
import {createUseStore} from '@/utils/mobx-utils/create-use-store'
import {ObjUtil} from '@/utils/obj-util'
import {makeAutoObservable, observable} from 'mobx'
import {Checkbox} from './types'

interface State {
  checklists: SupabaseQuery<Map<string, Checkbox[]>>
  progress: Map<string, number>
  progressText: Map<string, string>
}

export class PostChecklistStore {
  state: State = {
    checklists: {
      loading: false,
      data: new Map(),
      error: null
    },
    progress: new Map(),
    progressText: new Map()
  }

  constructor() {
    makeAutoObservable(this, {
      state: observable.deep
    })
  }

  setChecklists(checklist: State['checklists']): void {
    this.state.checklists = checklist
  }

  setProgress = (id: string): void => {
    const data = this.state.checklists.data?.get(id)
    if (!Array.isArray(data)) {
      console.error('Expected an array, but found:', data)
      return
    }
    if (!data) {
      return
    }

    this.state.progress.set(
      id,
      Math.round(
        (data.filter((s: Checkbox) => !!s && s.is_completed).length /
          data.length) *
          100
      )
    )
    const completed = (s: Checkbox): boolean => s.is_completed
    this.state.progressText.set(
      id,
      data.filter(completed).length + '/' + data.length
    )
  }

  handleUpdate = (
    id: string,
    oldCheckbox: Checkbox,
    newCheckbox: Checkbox
  ): void => {
    // Ensure checklists data is a Map and get the checklist for the given ID
    const checklistMap = this.state.checklists.data
    if (!checklistMap?.has(id)) {
      return
    }

    // Get existing array and map it to update the checkbox
    const checklist = checklistMap
      .get(id)
      ?.map(checkbox =>
        checkbox.id === oldCheckbox.id ? newCheckbox : checkbox
      )

    if (checklist) {
      // Create a new Map instance to trigger reactivity in state
      const updatedMap = new Map(checklistMap)
      updatedMap.set(id, checklist)

      // Update state
      this.setChecklists({
        ...this.state.checklists,
        data: updatedMap
      })
    }
  }

  handleInsert = (postId: string, newCheckbox: Checkbox): void => {
    const checklistMap = this.state.checklists.data

    if (!checklistMap) {
      return
    }

    // Get the existing checklist array or create a new one if the key doesn't exist
    const existingChecklist = checklistMap.get(postId) || []

    // Create a new Map instance to maintain reactivity
    const updatedMap = new Map(checklistMap)
    updatedMap.set(postId, [...existingChecklist, newCheckbox])

    // Update state with the new Map
    this.setChecklists({
      ...this.state.checklists,
      data: updatedMap
    })
  }

  handleDelete = (oldCheckbox: Checkbox): void => {
    const checklistMap = this.state.checklists.data
    if (!checklistMap) {
      return
    }

    const checkboxId = oldCheckbox.id

    // Find the post_id associated with the checkbox
    const checkboxPostId = ObjUtil.findInGroupedData(
      Object.fromEntries(checklistMap), // Convert Map to a plain object for compatibility
      'id',
      checkboxId
    )?.post_id

    if (!checkboxPostId) {
      return
    }

    // Get the existing checklist array
    const existingChecklist = checklistMap.get(checkboxPostId)
    if (!existingChecklist) {
      return
    }

    // Filter out the checkbox to be deleted
    const updatedChecklist = existingChecklist.filter(
      checkbox => checkbox.id !== checkboxId
    )

    // Create a new Map instance for reactivity
    const updatedMap = new Map(checklistMap)

    // If the checklist becomes empty, remove the entry entirely
    if (updatedChecklist.length > 0) {
      updatedMap.set(checkboxPostId, updatedChecklist)
    } else {
      updatedMap.delete(checkboxPostId)
    }

    // Update state with the new Map
    this.setChecklists({
      ...this.state.checklists,
      data: updatedMap
    })
  }
}

const [PostChecklistContext, usePostChecklistStore] =
  createUseStore<PostChecklistStore>()
export {PostChecklistContext, usePostChecklistStore}
