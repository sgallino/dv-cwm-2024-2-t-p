<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import useAuthUser from '../composables/useAuthUser.js';
import { saveChatMessage, subscribeToChatMessages } from '../services/public-chat.js';
import { formatDate } from '../libraries/date.js';

const { loggedUser } = useAuthUser();
const { loadingMessages, messages } = useChatMessages();
const { newMessage, handleSubmit } = useChatForm(loggedUser);

function useChatMessages() {
    let unsubscribeChat = () => {};
    const messages = ref([]);
    const loadingMessages = ref(false);

    onMounted(async () => {
        loadingMessages.value = true;
        unsubscribeChat = subscribeToChatMessages(newMessages => {
            loadingMessages.value = false;
            messages.value = newMessages;
        });
    });
    onUnmounted(() => unsubscribeChat());

    return {
        loadingMessages,
        messages,
    }
}

function useChatForm(user) {
    const newMessage = ref({
        text: '',
    });

    function handleSubmit() {
        try {
            saveChatMessage({
                user_id: user.value.id,
                email: user.value.email,
                text: newMessage.value.text,
            });

            newMessage.value.text = '';    
        } catch (error) {
            // TODO
        }
    };
    
    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <BaseHeading1>Chat Público</BaseHeading1>

    <div class="flex gap-4">
        <section class="w-9/12">
            <h2 class="sr-only">Mensajes</h2>

            <div class="p-4 border rounded">
                <BaseLoader v-if="loadingMessages" />
                <template   v-else>
                    <ul class="flex flex-col gap-4">
                        <li
                            v-for="message in messages"
                            :key="message.id"
                        >
                            <div class="mb-1">
                                <router-link
                                    :to="`/usuario/${message.user_id}`"
                                    class="font-bold text-blue-700 underline"
                                >{{ message.email }}</router-link> escribió:
                            </div>
                            <div>{{ message.text }}</div>
                            <div class="text-md text-gray-600">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
                        </li>
                    </ul>
                </template>
            </div>
        </section>
        <section class="w-3/12">
            <h2 class="text-xl mb-4">Enviar un mensaje</h2>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <span 
                        class="block mb-2"
                    >Email</span>
                    <p>{{ loggedUser.email }}</p>
                </div>
                <div class="mb-4">
                    <label 
                        for="text"
                        class="block mb-2"
                    >Mensaje</label>
                    <textarea
                        id="text"
                        class="w-full min-h-8 p-2 border rounded"
                        v-model="newMessage.text"
                    ></textarea>
                </div>
                <button 
                    type="submit"
                    class="transition-all py-2 px-4 rounded bg-blue-700 text-white focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-900"
                >Enviar</button>
            </form>
        </section>
    </div>
</template>