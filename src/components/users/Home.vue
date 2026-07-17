<template>
    <section>
        <div class="row">
            <div class="col-auto">
                <ul class="list-group">
                    <li class="list-group-item">
                        <Icon name="user" class="mx-1 me-2" />
                        {{ $auth.authData?.displayName ?? $auth.authData?.name }}
                    </li>
                    <li class="list-group-item">
                        <button type="button" class="btn btn-default p-1" @click="showChangePassword = !showChangePassword">
                            <Icon name="security" class="me-1" />
                            {{ $t("auth.changePassword") }}
                        </button>
                    </li>
                    <li class="list-group-item">
                        <button type="button" class="btn btn-default p-1" @click="showChangePersonalData = !showChangePersonalData">
                            <Icon name="contact" class="me-1" />
                            {{ $t("auth.personalData") }}
                        </button>
                    </li>
                    <li v-if="$isAdmin" class="list-group-item">
                        <router-link :to="{ name: 'admin' }" class="btn btn-default p-1">
                            <Icon name="people" class="me-1" />
                            {{ $t("manageUsers") }}
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <button type="button" class="btn btn-default p-1" @click="handleLogout">
                            <Icon name="exit" class="me-1" />
                            {{ $t("auth.signOut") }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <Teleport to="#modals">
        <MyModal
            :is-visible="showChangePassword"
            :title="$t('auth.changePassword')"
            :show-footer="false"
            @close="showChangePassword = false"
            @cancel="showChangePassword = false"
        >
            <ChangePasswordForm @success="showChangePassword = false" />
        </MyModal>
        <MyModal
            :is-visible="showChangePersonalData"
            :title="$t('auth.changePassword')"
            :show-footer="false"
            @close="showChangePersonalData = false"
            @cancel="showChangePersonalData = false"
        >
            <ChangePersonalData />
        </MyModal>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAuthStore } from "regira_modules/vue/auth"
import { ChangePasswordForm } from "regira_modules/vue/auth"
import ChangePersonalData from "./ChangePersonalData.vue"

const showChangePassword = ref(false)
const showChangePersonalData = ref(false)

const authStore = useAuthStore()
const handleLogout = () => {
    authStore.logout()
}
</script>
