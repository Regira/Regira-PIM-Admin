<template>
    <form @submit.prevent="handleSubmit">
        <div class="mb-2">
            <Feedback :feedback="feedback" />
        </div>
        <input type="text" class="form-control-plaintext" name="username" :value="username" autocomplete="username" readonly />
        <LoadingContainer v-if="model.token" :is-loading="isLoading">
            <div class="row mb-2">
                <div class="col">
                    <input type="password" class="form-control" name="password" v-model="model.password" autocomplete="new-password" required />
                    <FormLabel label="new password" />
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <input
                        type="password"
                        class="form-control"
                        name="passwordRepeat"
                        v-model="passwordRepeat"
                        autocomplete="new-password"
                        :class="{ 'is-invalid': !pwdMatches }"
                        required
                    />
                    <FormLabel label="repeat password" />
                    <div>
                        <small v-if="passwordRepeat && !pwdMatches" class="form-text text-danger">Passwords must match.</small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-end">
                    <button type="submit" class="btn btn-success" :disabled="!isFormValid">Submit</button>
                </div>
            </div>
        </LoadingContainer>
        <div v-else>
            <router-link :to="{ name: 'home' }">Log in</router-link>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { Feedback, useFeedback } from "regira_modules/vue/ui"
import { useAuth, useAuthStore, type IResetPasswordInput } from "regira_modules/vue/auth"

const router = useRouter()
const feedback = useFeedback()
const { service } = useAuth()

const isLoading = ref(false)
const model = reactive<IResetPasswordInput>({
    token: "",
    password: "",
})
const passwordRepeat = ref("")
const username = computed(() => JSON.parse(atob(router.currentRoute.value.query.token as string))?.username)
const pwdMatches = computed(() => model.password == passwordRepeat.value)
const isFormValid = computed(() => pwdMatches.value)

async function handleSubmit() {
    console.debug("handleChangePwd", { model })
    feedback.reset()
    isLoading.value = true
    try {
        await service.resetPassword(model)
        feedback.success("Password is changed")
        model.token = ""
        model.password = ""
        passwordRepeat.value = ""
    } catch (err: any) {
        console.error("Reset password failed", { err })
        feedback.fail("Reset password failed", err.response?.data)
    } finally {
        isLoading.value = false
    }
}

const authStore = useAuthStore()
watchEffect(() => {
    if (authStore.isAuthenticated) {
        router.replace("/")
        return
    }
    const route = router.currentRoute.value
    console.debug("ResetPassword", { route, token: route.query.token })
    model.token = route.query?.token as string
})
</script>
