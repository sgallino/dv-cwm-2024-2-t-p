import { onMounted, ref } from "vue";
import { getUserProfileById } from "../services/user-profile";

export default function useUserProfile(id) {
    const loading = ref(false);
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        photoURL: null,
        bio: null,
        career: null,
    });

    onMounted(async () => {
        loading.value = true;
        user.value = await getUserProfileById(id);
        loading.value = false;
    });

    return {
        loading,
        user,
    }
}