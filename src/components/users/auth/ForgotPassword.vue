<template>
    <form @submit.prevent="handleSubmit" style="height: 10rem">
        <div class="mb-2">
            <div v-if="feedback.status.value == FeedbackStatus.none" class="text-info">
                {{ $t("auth.fillInUsernameMsg") }}
            </div>
            <Feedback v-else :feedback="feedback" />
        </div>
        <LoadingContainer :is-loading="isLoading">
            <div class="row mb-2">
                <label class="d-none d-sm-block col-sm-3 col-form-label">{{ $t("auth.username") }}</label>
                <div class="col">
                    <input
                        type="text"
                        class="form-control"
                        name="username"
                        v-model="username"
                        autocomplete="username"
                        required
                        :readonly="isSuccess"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div v-if="isSuccess">
                        <p class="text-success">
                            {{ $t("auth.passwordResetReceivedMsg") }}
                        </p>
                    </div>
                    <button v-else type="submit" class="btn btn-primary" :disabled="!isFormValid">
                        {{ $t("submit") }}
                    </button>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-link px-0" @click="$emit('login', username)">
                        {{ $t("auth.signIn") }}
                    </button>
                </div>
            </div>
        </LoadingContainer>
    </form>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useRouter } from "vue-router"
import { Feedback, useFeedback, FeedbackStatus } from "regira_modules/vue/ui"
import { useForgotPasswordForm, type ForgotPasswordFormEmits, type ForgotPasswordFormProps } from "regira_modules/vue/auth"
import { useLang } from "regira_modules/vue/lang"
import { useConfig } from "@/app-config"

interface IEmits extends /* @vue-ignore */ ForgotPasswordFormEmits {}
const emit = defineEmits<IEmits>()

const props: ForgotPasswordFormProps = defineProps<{
    username?: string
}>()

const config = useConfig()
const router = useRouter()
const { translate, translateMessage } = useLang()

const resetPasswordRoute = router.resolve({ name: "resetPassword" })
const siteUrl = `${location.protocol}//${location.host}${config.baseUrl}${resetPasswordRoute.fullPath}`

const { username, isLoading, isFormValid, isSuccess, handleSubmit } = useForgotPasswordForm(props, emit, {
    siteUrl,
    siteName: translateMessage(config.title),
})

const feedback = useFeedback()
watchEffect(() => {
    if (isSuccess.value) {
        feedback.success(translate("auth.passwordResetSent"))
    } else if (isSuccess.value === false) {
        feedback.fail(translate("auth.passwordResetFailed"))
    } else {
        feedback.reset()
    }
})
</script>
