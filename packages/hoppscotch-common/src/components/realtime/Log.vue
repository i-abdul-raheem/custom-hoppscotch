<template>
  <div class="flex flex-col flex-1 overflow-auto whitespace-nowrap">
    <div
      v-if="log.length !== 0"
      class="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 pl-4 overflow-x-auto border-b bg-primary border-dividerLight"
    >
      <label for="log" class="font-semibold truncate text-secondaryLight">
        {{ title }}
      </label>
      <div class="flex">
        <HoppButtonSecondary
          v-tippy="{ theme: 'tooltip' }"
          :title="t('action.delete')"
          :icon="IconTrash"
          @click="emit('delete')"
        />
        <HoppButtonSecondary
          id="bottompage"
          v-tippy="{ theme: 'tooltip' }"
          :title="t('action.scroll_to_top')"
          :icon="IconArrowUp"
          @click="scrollTo('top')"
        />
        <HoppButtonSecondary
          id="bottompage"
          v-tippy="{ theme: 'tooltip' }"
          :title="t('action.scroll_to_bottom')"
          :icon="IconArrowDown"
          @click="scrollTo('bottom')"
        />
        <HoppButtonSecondary
          id="bottompage"
          v-tippy="{ theme: 'tooltip' }"
          :title="`${t('action.autoscroll')}: ${
            autoScrollEnabled ? t('action.turn_off') : t('action.turn_on')
          }`"
          :icon="IconChevronsDown"
          :class="toggleAutoscrollColor"
          @click="toggleAutoscroll()"
        />
      </div>
    </div>
    <div
      v-if="log.length !== 0"
      ref="logs"
      class="flex flex-col flex-1 overflow-y-auto"
    >
      <div class="border-b border-dividerLight">
        <div class="flex flex-col divide-y divide-dividerLight">
          <RealtimeLogEntry
            v-for="(entry, index) in log"
            :key="`entry-${index}`"
            :entry="entry"
          />
        </div>
      </div>
    </div>
    <AppShortcutsPrompt v-else class="p-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, computed, watch, Ref } from "vue"
import IconTrash from "~icons/lucide/trash"
import IconArrowUp from "~icons/lucide/arrow-up"
import IconArrowDown from "~icons/lucide/arrow-down"
import IconChevronsDown from "~icons/lucide/chevron-down"
import { useThrottleFn, useScroll } from "@vueuse/core"
import { useI18n } from "@composables/i18n"

export type LogEntryData = {
  prefix?: string
  ts: number | undefined
  source: "info" | "client" | "server" | "disconnected"
  payload: string
  event?: "connecting" | "connected" | "disconnected" | "error"
}

const props = defineProps({
  log: { type: Array as PropType<LogEntryData[]>, default: () => [] },
  title: {
    type: String,
    default: "",
  },
})

const emit = defineEmits<{
  (e: "delete"): void
}>()

const t = useI18n()

const logs = ref<HTMLElement>()

const autoScrollEnabled = ref(true)

const logListScroll = useScroll(logs as Ref<HTMLElement>)

// Disable autoscroll when scrolling to top
watch(logListScroll.isScrolling, (isScrolling) => {
  if (isScrolling && logListScroll.directions.top)
    autoScrollEnabled.value = false
})

const scrollTo = (position: "top" | "bottom") => {
  if (position === "top") {
    logs.value?.scroll({
      behavior: "smooth",
      top: 0,
    })
  } else if (position === "bottom") {
    logs.value?.scroll({
      behavior: "smooth",
      top: logs.value?.scrollHeight,
    })
  }
}

watch(
  () => props.log,
  useThrottleFn(() => {
    if (autoScrollEnabled.value) scrollTo("bottom")
  }, 200),
  { flush: "post" }
)

const toggleAutoscroll = () => {
  autoScrollEnabled.value = !autoScrollEnabled.value
}

const toggleAutoscrollColor = computed(() =>
  autoScrollEnabled.value ? "text-green-500" : "text-red-500"
)
</script>
