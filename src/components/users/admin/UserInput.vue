<template>
    <form @submit.prevent="handleSubmit">
        <LoadingContainer :is-loading="isLoading">
            <div class="row">
                <div class="col mb-2">
                    <div class="input-group">
                        <div class="input-group-text opacity-50">
                            <Icon name="user" />
                        </div>
                        <input type="email" v-model="item.email" class="form-control" :placeholder="$t('usernameLabel')" />
                        <div class="input-group-text">
                            <label class="form-check-label mx-1">
                                <input type="checkbox" v-model="item.permissions" value="can_read" class="form-check-input" />
                                {{ $t("claims.canRead") }}
                            </label>
                            <label class="form-check-label mx-1">
                                <input type="checkbox" v-model="item.permissions" value="can_write" class="form-check-input" />
                                {{ $t("claims.canWrite") }}
                            </label>
                        </div>
                        <button type="submit" class="btn btn-outline-success py-1">
                            <Icon name="new" class="me-1" />
                        </button>
                    </div>
                </div>
            </div>
        </LoadingContainer>
    </form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Entity from "./Entity"
import { saveUser, buildConfirmEmailUrl } from "./functions"

const emit = defineEmits<{
    (e: "save", arg: { saved: Entity; isNew: boolean }): void
}>()

const router = useRouter()
const siteUrl = buildConfirmEmailUrl(router)

const item = ref<Entity>(new Entity())

const isLoading = ref(false)
async function handleSubmit() {
    isLoading.value = true
    try {
        const isNew = !item.value?.id
        await saveUser(item.value, siteUrl)
        emit("save", { saved: item.value, isNew })
        item.value = new Entity()
    } finally {
        isLoading.value = false
    }
}
</script>
