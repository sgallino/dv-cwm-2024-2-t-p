<script setup>
defineProps({
    user: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div class="flex gap-4 items-start">
        <div class="w-1/6">
            <img 
                v-if="user.photoURL"
                :src="user.photoURL"
                alt=""
            >
            <p 
                v-else
            >Sin foto de perfil</p>
        </div>
        <div>
            <div class="mb-4">{{ user.bio || 'Acá va mi biografía...' }}</div>

            <dl>
                <dt class="font-bold">Email:</dt>
                <dd class="mb-3">{{ user.email }}</dd>
                <dt class="font-bold">Nombre de Usuario:</dt>
                <dd class="mb-3">{{ user.displayName || 'Sin especificar' }}</dd>
                <dt class="font-bold">Carrera:</dt>
                <dd class="mb-3">{{ user.career || 'Sin especificar' }}</dd>
            </dl>
        </div>
    </div>
</template>