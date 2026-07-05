<template>
    <form @submit.prevent="handleSubmit" ref="loginForm">
        <div class="mb-3 position-relative" v-if="failed">
            <div class="bg-danger border rounded text-light p-2">
                {{ $t("auth.signInErrorMsg") }}
                <span v-if="isLockedOut">{{ $t("auth.tryAgainInMin", { minutes: 5 }) }}</span>
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">{{ $t("auth.username") }}</label>
            <div class="col-sm-9">
                <div class="input-group">
                    <input class="form-control" autocomplete="username email" v-model="username" :disabled="signingIn" />
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">{{ $t("auth.password") }}</label>
            <div class="col-sm-9">
                <input type="password" class="form-control" autocomplete="password current-password" v-model="password" :disabled="signingIn" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button type="submit" class="btn btn-primary" :disabled="signingIn">
                    {{ $t("auth.signIn") }}
                </button>
            </div>
            <div class="col-auto">
                <span v-if="signingIn" class="text-info">
                    <Loading class="me-1" style="width: 2rem" />
                    {{ $t("auth.signingIn") }}
                </span>
                <button v-else type="button" class="btn btn-link" @click="handleForgotPassword">
                    {{ $t("auth.forgotPassword") }}
                </button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useLoginForm, type ILoginEmits, type ILoginProps } from "regira_modules/vue/auth"

interface IEmits extends /* @vue-ignore */ ILoginEmits {}
const emit = defineEmits<IEmits>()

const props: ILoginProps = defineProps<{
    username?: string
    signingIn?: boolean
}>()

const { username, password, signingIn, failed, isLockedOut, handleSubmit, handleForgotPassword } = useLoginForm(props, emit)
</script>
