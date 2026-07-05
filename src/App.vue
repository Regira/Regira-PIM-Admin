<template>
    <div class="page">
        <Offline />

        <header class="container-fluid bg-light">
            <Header />
        </header>

        <section class="container-fluid feedback-container position-relative overflow-hidden">
            <Feedback :feedback="$feedback" :enable-error-popup="true" />
            <AppDebug />
        </section>

        <main class="container-fluid">
            <LoadingContainer :isLoading="$appStatus != AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)">
                <Main />
            </LoadingContainer>
        </main>

        <footer class="container-fluid bg-light">
            <Footer />
        </footer>

        <Teleport to="#loginModal">
            <LoginModal v-if="showLogin" :title="$t('signIn')">
                <DemoLoginForm v-if="isDemo" :username="username" class="pt-2" @forgot-password="openForgotPassword" />
                <LoginForm v-else :username="username" class="pt-2" @forgot-password="openForgotPassword" />
            </LoginModal>
            <ForgotPasswordModal v-if="showForgotPassword" @close="showForgotPassword = false">
                <ForgotPassword :username="username" class="pt-2" @login="openLogin" />
            </ForgotPasswordModal>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Feedback } from "regira_modules/vue/ui"
import { LoginModal, ForgotPasswordModal, useAuthStore } from "regira_modules/vue/auth"
import { AppStatus } from "regira_modules/vue/app"
import { useConfig } from "@/app-config"
import Header from "@/components/layout/TheHeader.vue"
import Footer from "@/components/layout/TheFooter.vue"
import Main from "@/components/layout/Main.vue"
import Offline from "@/components/layout/Offline.vue"
import AppDebug from "@/components/layout/AppDebug.vue"
import LoginForm from "@/components/users/auth/LoginForm.vue"
import DemoLoginForm from "@/components/users/auth/LoginFormDemo.vue"
import ForgotPassword from "@/components/users/auth/ForgotPassword.vue"

const showForgotPassword = ref(false)
const username = ref<string>()
function openForgotPassword(e?: string) {
    showForgotPassword.value = true
    username.value = e || ""
}
const authStore = useAuthStore()
const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
function openLogin(login?: string) {
    showForgotPassword.value = false
    username.value = login
}

const { isDemo } = useConfig()
</script>
