<template>
    <div class="row mb-2">
        <div class="col">
            <div class="input-group" :class="{ 'is-deleted': !item.permissions?.length }">
                <div class="input-group-text">
                    <Loading v-if="isLoading" style="height: 1.5rem" />
                    <Icon v-else :name="isAdminUser ? 'admin' : 'user'" />
                </div>
                <div class="form-control">
                    {{ item.email }}
                </div>
                <div class="input-group-text">
                    <label class="form-check-label mx-1">
                        <input
                            type="checkbox"
                            v-model="item.permissions"
                            :value="Permissions.CAN_READ"
                            :disabled="isAdminUser"
                            class="form-check-input"
                            @click="toggleCanRead"
                            @change="handleUpdateUser"
                        />
                        {{ $t("claims.canRead") }}
                    </label>
                    <label class="form-check-label mx-1">
                        <input
                            type="checkbox"
                            v-model="item.permissions"
                            :value="Permissions.CAN_WRITE"
                            :disabled="isAdminUser"
                            class="form-check-input"
                            @click="toggleCanWrite"
                            @change="handleUpdateUser"
                        />
                        {{ $t("claims.canWrite") }}
                    </label>
                </div>
                <IconButton icon="delete" class="btn-outline-danger py-1" @click="handleRemoveUser" :disabled="isAdminUser" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import Permissions from "@/infrastructure/permissions"
import Entity from "./Entity"
import { saveUser, isAdmin } from "./functions"

const isLoading = ref(false)
const item = defineModel<Entity>({ required: true })
const isAdminUser = computed(() => isAdmin(item.value))

function toggleCanRead() {
    if (item.value.permissions.includes(Permissions.CAN_READ) && item.value.permissions.includes(Permissions.CAN_WRITE)) {
        item.value.permissions = []
    }
}
function toggleCanWrite() {
    if (!item.value.permissions.includes(Permissions.CAN_READ) && !item.value.permissions.includes(Permissions.CAN_WRITE)) {
        item.value.permissions = [Permissions.CAN_READ, Permissions.CAN_WRITE]
    }
}
async function handleUpdateUser() {
    isLoading.value = true
    try {
        item.value = await saveUser(item.value)
    } finally {
        isLoading.value = false
    }
}
async function handleRemoveUser() {
    const itemWithoutPermissions = Object.assign(new Entity(), {
        ...item.value,
        permissions: [],
    })
    isLoading.value = true
    try {
        item.value = await saveUser(itemWithoutPermissions)
    } finally {
        isLoading.value = false
    }
}
</script>
