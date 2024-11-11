import { onUnmounted, ref } from "vue";
import { subscribeToAuthState } from "../services/auth";

/**
 * Retorna los datos del usuario autenticado.
 */
export default function useAuthUser() {
    const loggedUser = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        career: null,
        photoURL: null,
    });

    let unsubscribeAuth = subscribeToAuthState(newUserData => loggedUser.value = newUserData);

    onUnmounted(() => unsubscribeAuth());

    return {
        loggedUser,
    }
}