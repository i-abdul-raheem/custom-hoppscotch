import { isEqual } from "lodash-es"
import { computed } from "vue"
import { getDefaultRESTRequest } from "~/helpers/rest/default"
import { HoppRESTDocument, HoppRESTSaveContext } from "~/helpers/rest/document"
import { TabService } from "./tab"

export class RESTTabService extends TabService<HoppRESTDocument> {
  public static readonly ID = "REST_TAB_SERVICE"

  constructor() {
    super()

    this.tabMap.set("test", {
      id: "test",
      document: {
        request: getDefaultRESTRequest(),
        isDirty: false,
        optionTabPreference: "params",
      },
    })

    this.watchCurrentTabID()
  }

  // override persistableTabState to remove response from the document
  public override persistableTabState = computed(() => ({
    lastActiveTabID: this.currentTabID.value,
    orderedDocs: this.tabOrdering.value.map((tabID) => {
      const tab = this.tabMap.get(tabID)! // tab ordering is guaranteed to have value for this key
      return {
        tabID: tab.id,
        doc: {
          ...tab.document,
          response: null,
        },
      }
    }),
  }))

  public getTabRefWithSaveContext(ctx: HoppRESTSaveContext) {
    for (const tab of this.tabMap.values()) {
      // For `team-collection` request id can be considered unique
      if (ctx?.originLocation === "team-collection") {
        if (
          tab.document.saveContext?.originLocation === "team-collection" &&
          tab.document.saveContext.requestID === ctx.requestID
        ) {
          return this.getTabRef(tab.id)
        }
      } else if (isEqual(ctx, tab.document.saveContext)) {
        return this.getTabRef(tab.id)
      }
    }

    return null
  }

  public getDirtyTabsCount() {
    let count = 0

    for (const tab of this.tabMap.values()) {
      if (tab.document.isDirty) count++
    }

    return count
  }
}
