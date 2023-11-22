import { Service } from "dioc"
import { watch, type Ref, ref, reactive, effectScope, Component } from "vue"

/**
 * Defines how to render the entry text in a Spotlight Search Result
 */
export type SpotlightResultTextType<T extends object | Component = never> =
  | {
      type: "text"
      /**
       * The text to render. Passing an array of strings will render each string separated by a chevron
       */
      text: string[] | string
    }
  | {
      type: "custom"
      /**
       * The component to render in place of the text
       */
      component: T

      /**
       * The props to pass to the component
       */
      componentProps: T extends Component<infer Props> ? Props : never
    }

/**
 * Defines info about a spotlight light so the UI can render it
 */
export type SpotlightSearcherResult = {
  /**
   * The unique ID of the result
   */
  id: string

  /**
   * The text to render in the result
   */
  text: SpotlightResultTextType<any>

  /**
   * The icon to render as the signifier of the result
   */
  icon: object | Component

  /**
   * The score of the result, the UI should sort the results by this
   */
  score: number

  /**
   * Additional metadata about the result
   */
  meta?: {
    /**
     * The keyboard shortcut to trigger the result
     */
    keyboardShortcut?: string[]
  }
}

/**
 * Defines the state of a searcher during a spotlight search session
 */
export type SpotlightSearcherSessionState = {
  /**
   * Whether the searcher is currently loading results
   */
  loading: boolean

  /**
   * The results presented by the corresponding searcher in a session
   */
  results: SpotlightSearcherResult[]
}

export interface SpotlightSearcher {
  searcherID: string
  searcherSectionTitle: string

  createSearchSession(
    query: Readonly<Ref<string>>
  ): [Ref<SpotlightSearcherSessionState>, () => void]

  onResultSelect(result: SpotlightSearcherResult): void
}

/**
 * Defines the state of a searcher during a search session that
 * is exposed to through the spotlight service
 */
export type SpotlightSearchSearcherState = {
  title: string
  avgScore: number
  results: SpotlightSearcherResult[]
}

/**
 * Defines the state of a spotlight search session
 */
export type SpotlightSearchState = {
  /**
   * Whether any of the searchers are currently loading results
   */
  loading: boolean

  /**
   * The results presented by the corresponding searcher in a session
   */
  results: Record<string, SpotlightSearchSearcherState>
}

export class SpotlightService extends Service {
  public static readonly ID = "SPOTLIGHT_SERVICE"

  private searchers: Map<string, SpotlightSearcher> = new Map()

  /**
   * Registers a searcher with the spotlight service
   * @param searcher The searcher instance to register
   */
  public registerSearcher(searcher: SpotlightSearcher) {
    this.searchers.set(searcher.searcherID, searcher)
  }

  /**
   * Gets an iterator over all registered searchers and their IDs
   */
  public getAllSearchers(): IterableIterator<[string, SpotlightSearcher]> {
    return this.searchers.entries()
  }

  /**
   * Creates a new search session
   * @param query A ref to the query to search for, updating this ref will notify the searchers about the change
   * @returns A ref to the state of the search session and a function to end the session
   */
  public createSearchSession(
    query: Ref<string>
  ): [Ref<SpotlightSearchState>, () => void] {
    const searchSessions = Array.from(this.searchers.values()).map(
      (x) => [x, ...x.createSearchSession(query)] as const
    )

    const loadingSearchers = reactive(new Set())
    const onSessionEndList: Array<() => void> = []

    const resultObj = ref<SpotlightSearchState>({
      loading: false,
      results: {},
    })

    const scopeHandle = effectScope()

    scopeHandle.run(() => {
      for (const [searcher, state, onSessionEnd] of searchSessions) {
        watch(
          state,
          (newState) => {
            if (newState.loading) {
              loadingSearchers.add(searcher.searcherID)
            } else {
              loadingSearchers.delete(searcher.searcherID)
            }

            if (newState.results.length === 0) {
              delete resultObj.value.results[searcher.searcherID]
            } else {
              resultObj.value.results[searcher.searcherID] = {
                title: searcher.searcherSectionTitle,
                avgScore:
                  newState.results.reduce((acc, x) => acc + x.score, 0) /
                  newState.results.length,
                results: newState.results,
              }
            }
          },
          { immediate: true }
        )

        onSessionEndList.push(onSessionEnd)
      }

      watch(
        loadingSearchers,
        (set) => {
          resultObj.value.loading = set.size > 0
        },
        { immediate: true }
      )
    })

    const onSearchEnd = () => {
      scopeHandle.stop()

      for (const onEnd of onSessionEndList) {
        onEnd()
      }
    }

    return [resultObj, onSearchEnd]
  }

  /**
   * Selects a search result. To be called when the user selects a result
   * @param searcherID The ID of the searcher that the result belongs to
   * @param result The resuklt to look at
   */
  public selectSearchResult(
    searcherID: string,
    result: SpotlightSearcherResult
  ) {
    this.searchers.get(searcherID)?.onResultSelect(result)
  }
}
