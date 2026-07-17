<template>
    <ResetPasswordForm v-if="token" :token="token" @login="router.replace({ name: 'home' })" />
    <div v-else>
        <router-link :to="{ name: 'home' }">{{ $t("signIn") }}</router-link>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { ResetPasswordForm, useAuthStore } from "regira_modules/vue/auth"

const router = useRouter()
const authStore = useAuthStore()

// The reset token arrives as a query param on the recovery link; the library
// form owns the submit/loading/feedback state — we only feed it the token.
const token = ref<string>("")
watchEffect(() => {
    if (authStore.isAuthenticated) {
        router.replace("/")
        return
    }
    token.value = (router.currentRoute.value.query?.token as string) ?? ""
})
</script>
