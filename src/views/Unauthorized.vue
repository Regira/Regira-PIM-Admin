<template>
    <section>
        <h1>Unauthorized</h1>
        <p>Please authenticate</p>
        <p>
            You're not authorized to visit page
            <router-link :to="url">{{ url }}</router-link>
            .
        </p>
    </section>
</template>

<script setup lang="ts">
defineProps({ url: { type: String, default: "/" } })
</script>
