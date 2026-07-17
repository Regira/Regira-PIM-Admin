<template>
    <nav class="navbar navbar-expand-sm bg-body-tertiary" v-click-outside="handleCloseMenu">
        <router-link class="navbar-brand" :to="{ name: 'home' }" :title="`${$t('productInformationManagement')} v${version}`">
            <img :src="logo" style="height: 2rem; vertical-align: top" class="me-1" />
            <span class="d-sm-none d-md-inline"> {{ $t("pimManager") }} </span>
        </router-link>
        <button class="navbar-toggler" type="button" @click.stop="showNavbarContent = !showNavbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse bg-light px-2 px-md-0 pt-2 pt-sm-0" :class="{ show: showNavbarContent }">
            <ul class="navbar-nav mb-2 mb-lg-0">
                <li class="nav-item py-2 py-sm-0 d-none">
                    <router-link
                        class="nav-link"
                        aria-current="page"
                        :to="{ name: 'home' }"
                        :title="`${$t('productInformationManagement')} v${version}`"
                        >{{ $t("pimManager") }}</router-link
                    >
                </li>
            </ul>
            <NavBar class="navbar-nav ms-1 mb-2 mb-lg-0" @select="handleCloseMenu" />
            <form class="d-flex mb-4 mb-sm-0">
                <div class="row my-2 my-sm-0">
                    <div v-if="$auth.enabled" class="col">
                        <AccountMenu :isAuthenticated="$auth.isAuthenticated" @close="handleCloseMenu" />
                    </div>
                    <div class="col-auto pt-2">
                        <LangSelector class="float-end" :langs="['en', 'fr', 'nl']" />
                    </div>
                </div>
            </form>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useConfig } from "@/app-config"
import logo from "@/assets/images/logo-sm.png"
import { NavBar } from "@/components/entity-navigation"
import AccountMenu from "@/components/users/HeaderMenu.vue"
import { LangSelector } from "regira_modules/vue/lang"

const { version } = useConfig()

const showNavbarContent = ref(false)
const showNavbarManagementDropdown = ref(false)

document.addEventListener("click", () => {
    showNavbarContent.value = false
    showNavbarManagementDropdown.value = false
})

function handleCloseMenu() {
    showNavbarContent.value = false
}
</script>
