<template>
    <form @submit.prevent="handleSubmit">
        <div class="mb-2">
            <Feedback :feedback="feedback" />
        </div>
        <LoadingContainer :is-loading="isLoading">
            <div class="row mb-2">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-text">
                            <Icon name="title" />
                        </div>
                        <input class="form-control" name="fname" v-model="model.givenName" placeholder="John" autocomplete="given-name" />
                    </div>
                    <FormLabel :label="$t('auth.givenName')" />
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-text">
                            <Icon name="title" />
                        </div>
                        <input class="form-control" name="flame" v-model="model.lastName" placeholder="Doe" autocomplete="family-name" />
                    </div>
                    <FormLabel :label="$t('auth.lastName')" />
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-text">
                            <Icon name="language" />
                        </div>
                        <select v-model="model.culture" class="form-select">
                            <option value=""></option>
                            <option v-for="(lang, culture) in cultures" :key="culture" :value="culture">
                                {{ lang }}
                            </option>
                        </select>
                    </div>
                    <FormLabel :label="$t('auth.culture')" />
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-end">
                    <button type="submit" class="btn btn-success">
                        {{ $t("submit") }}
                    </button>
                </div>
            </div>
        </LoadingContainer>
        <Debug :modelValue="model" />
    </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useAxios } from "regira_modules/vue/http"
import { Feedback, useFeedback } from "regira_modules/vue/ui"
import { useAuthStore } from "regira_modules/vue/auth"
import { useLang } from "regira_modules/vue/lang"
import { useConfig } from "@/app-config"

const { translate } = useLang()
const feedback = useFeedback()
const { authData, refresh: refreshToken } = useAuthStore()

const isLoading = ref(false)

type IChangePersonalDataInput = {
    givenName?: string
    lastName?: string
    culture?: string
}
const model = reactive<IChangePersonalDataInput>({
    givenName: authData.get("given_name") as string,
    lastName: authData.get("last_name") as string,
    culture: authData.get("culture") as string,
})
const { cultures } = useConfig()

async function handleSubmit() {
    feedback.reset()
    isLoading.value = true
    try {
        await changePersonalData(model)
        feedback.success(translate("auth.personalDataChanged"))
        // refresh token to renew it's claims
        await refreshToken({})
    } catch (err: any) {
        console.error("Changing personal data failed", { err })
        feedback.fail(translate("auth.changePersonalDataFailed"), err.response?.data)
    } finally {
        isLoading.value = false
    }
}

async function changePersonalData(input: IChangePersonalDataInput) {
    const url = `profile/personal-data`
    const axios = useAxios()
    const response = await axios.post(url, input)
    console.debug("changePersonalData", { response })
}
</script>
