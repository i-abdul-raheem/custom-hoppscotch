<template>
  <div>
    <div
      v-if="isLoadingInitialRoute"
      class="flex flex-col items-center justify-center min-h-screen"
    >
      <HoppSmartSpinner />
    </div>
    <ErrorPage v-if="errorInfo !== null" :error="errorInfo" />
    <RouterView v-if="isKeycloakValidated" />
    <div v-else class="flex justify-center flex-col items-center">
      <div class="flex justify-center flex-col items-center min-h-[700px]">
        <h1 class="text-xl mb-5">You need to login first.</h1>
        <div>
          <HoppButtonSecondary
            v-tippy="{ theme: 'tooltip', delay: [500, 20], allowHTML: true }"
            :label="`${t('Validate')}`"
            class="rounded text-white bg-[#4E45E4]"
            @click="initKeycloak()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import ErrorPage, { ErrorPageData } from "~/pages/_.vue"
import { HOPP_MODULES } from "@modules/."
import { isLoadingInitialRoute } from "@modules/router"
import { useI18n } from "@composables/i18n"
import { APP_IS_IN_DEV_MODE } from "@helpers/dev"
import { platform } from "./platform"
import Keycloak from "keycloak-js"

const t = useI18n()
const router = useRouter()
const errorInfo = ref<ErrorPageData | null>(null)
const isKeycloakValidated = ref(false)
const keycloak = ref<Keycloak | null>(null)
let keycloakInitialized = false

const formatErrorMessage = (err: Error | null | undefined) => {
  if (!err) return null
  return `${err.name}: ${err.message}`
}



const initKeycloak = async () => {
console.log('first')
  try {
    if (keycloakInitialized) {
      console.log("Keycloak already initialized. Skipping...")
      return
    }

    const keycloakConfig = {
      url: "http://localhost:8080",
      realm: "greenbox",
      clientId: "hoppscotch",
    }

    keycloak.value = new Keycloak(keycloakConfig)

    try {
      const authenticated = await keycloak.value.init({
        onLoad: "check-sso",
      })

      if (authenticated) {
        isKeycloakValidated.value = true
      } else {
        // If not authenticated, perform the login and wait for it to complete
        await keycloak.value.login()
        // After login, recheck authentication status
        const reAuthenticated = await keycloak.value.init({
          onLoad: "check-sso",
        })
        if (reAuthenticated) {
          isKeycloakValidated.value = true
        }
      }
    } catch (error) {
      throw error
    }

    keycloakInitialized = true
  } catch (err) {
    throw err
  }
}

onMounted(() => {
  if (APP_IS_IN_DEV_MODE) {
    window.onerror = (_, _1, _2, _3, err) => {
      errorInfo.value = {
        statusCode: 500,
        message: formatErrorMessage(err) ?? t("error.something_went_wrong"),
      }
      return false
    }
  }

  initKeycloak()

  HOPP_MODULES.forEach((mod) => mod.onRootSetup?.())
  platform.addedHoppModules?.forEach((mod) => mod.onRootSetup?.())
})
</script>
