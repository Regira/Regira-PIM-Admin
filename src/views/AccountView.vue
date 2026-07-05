<template>
    <section>
        <router-view></router-view>

        <Debug
            :modelValue="{
                userId: $auth.authData?.userId,
                username: $auth.authData?.name,
                auth: $auth,
            }"
        />
    </section>
</template>

