import { AuthPlatformDef } from "./auth"
import { UIPlatformDef } from "./ui"
import { EnvironmentsPlatformDef } from "./environments"
import { CollectionsPlatformDef } from "./collections"
import { SettingsPlatformDef } from "./settings"
import { HistoryPlatformDef } from "./history"
import { TabStatePlatformDef } from "./tab"
import { AnalyticsPlatformDef } from "./analytics"
import { InterceptorsPlatformDef } from "./interceptors"
import { HoppModule } from "~/modules"
import { InspectorsPlatformDef } from "./inspectors"

export type PlatformDef = {
  ui?: UIPlatformDef
  addedHoppModules?: HoppModule[]
  auth: AuthPlatformDef
  analytics?: AnalyticsPlatformDef
  sync: {
    environments: EnvironmentsPlatformDef
    collections: CollectionsPlatformDef
    settings: SettingsPlatformDef
    history: HistoryPlatformDef
    tabState: TabStatePlatformDef
  }
  interceptors: InterceptorsPlatformDef
  additionalInspectors?: InspectorsPlatformDef
  platformFeatureFlags: {
    exportAsGIST: boolean
  }
}

export let platform: PlatformDef

export function setPlatformDef(def: PlatformDef) {
  platform = def
}
