<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';
import useAuthUser from '../composables/useAuthUser';
import useUserProfile from '../composables/useUserProfile';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { formatDate } from '../libraries/date';

const route = useRoute();

const { loggedUser } = useAuthUser();
const { user, loading: loadingUser } = useUserProfile(route.params.id);
const { newMessage, handleSubmit } = usePrivateChatForm(loggedUser.value.id, route.params.id);
const { loadingMessages, messages } = usePrivateChatMessages(loggedUser.value.id, route.params.id);

function usePrivateChatMessages(senderId, receiverId) {
    let unsubscribeChat = () => {}
    const loadingMessages = ref(false);
    const messages = ref([]);

    onMounted(async () => {
        loadingMessages.value = true;
        unsubscribeChat = await subscribeToPrivateChatMessages(
            senderId,
            receiverId,
            newMessages => {
                loadingMessages.value = false;
                messages.value = newMessages;
            }
        );
    });

    onUnmounted(() => unsubscribeChat);

    return {
        loadingMessages,
        messages,
    }
}

function usePrivateChatForm(senderId, receiverId) {
    const newMessage = ref({
        text: '',
    });

    async function handleSubmit() {
        try {
            savePrivateChatMessage(
                senderId,
                receiverId,
                newMessage.value.text,
            );
            newMessage.value.text = '';
        } catch (error) {
            // TODO...
        }
    }

    return {
        newMessage,
        handleSubmit,
    }
}
</script>

<template>
    <BaseLoader v-if="loadingUser" />
    <template   v-else>
        <BaseHeading1>Conversación Privada con {{ user.email }}</BaseHeading1>

        <div class="min-h-[400px] p-4 mb-4 border rounded">
            <ul class="flex flex-col items-start gap-4">
                <li
                    v-for="message in messages"
                    :key="message.id"
                    :class="{
                        'bg-gray-200': message.user_id !== loggedUser.id,
                        'bg-green-200': message.user_id === loggedUser.id,
                        'self-end': message.user_id === loggedUser.id,
                    }"
                    class="p-4 rounded"
                >
                    <div>{{ message.text }}</div>
                    <div class="text-md text-gray-600">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
                </li>
            </ul>
        </div>

        <form 
            action="#"
            class="flex gap-4 items-stretch"
            @submit.prevent="handleSubmit"
        >
            <label 
                for="text"
                class="sr-only"
            >Mensaje</label>
            <textarea
                id="text"
                class="w-full min-h-8 p-2 border rounded"
                v-model="newMessage.text"
            ></textarea>
            <button 
                type="submit"
                class="transition-all py-2 px-4 rounded bg-blue-700 text-white focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-900"
            >Enviar</button>
        </form>
    </template>
</template>