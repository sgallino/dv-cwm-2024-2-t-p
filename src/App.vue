<script>
import { logout, subscribeToAuthState } from './services/auth';

export default {
    name: 'App',
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
                career: null,
            },
        }
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push('/iniciar-sesion');
        },
    },
    mounted() {
        // Nos "suscribimos" a los cambios en el estado de autenticación de Firebase a través
        // de la función onAuthStateChanged().
        // Recibe 2 parámetros:
        // 1. Referencia a Auth.
        // 2. Callback que recibe como argumento el usuario autenticado o null.
        // Retorna una función para cancelar la suscripción.
        // onAuthStateChanged(auth, user => {
        //     if(user) {
        //         this.loggedUser = {
        //             id: user.uid,
        //             email: user.email,
        //         }
        //     } else {
        //         this.loggedUser = {
        //             id: null,
        //             email: null,
        //         }
        //     }
        // });

        subscribeToAuthState(newUserData => this.loggedUser = newUserData);
    }
}
</script>

<template>
    <!-- 
    En estilos donde tenemos que poner un tamaño, es muy común que Tailwind
    nos permita aclarar ese valor en "rems".
    Como habitualmente un rem equivale a 16px (salvo que el usuario defina
    otra configuración), Tailwind fracciona los números en un cuarto de rem
    o 4px.
    Es decir, si tenemos:
    p-2 => .5rem    (8px)
    p-3 => .75rem   (12px)
    p-4 => 1rem     (16px)
    -->
    <nav class="flex justify-between items-center w-full p-4 bg-slate-200 text-gray-950">
        <router-link to="/" class="text-xl">DV Social</router-link>
        <ul class="flex gap-2 items-center">
            <li><router-link class="block py-1 px-2" to="/">Home</router-link></li>
            <template v-if="loggedUser.id === null">
                <li><router-link class="block py-1 px-2" to="/registro">Registro</router-link></li>
                <li><router-link class="block py-1 px-2" to="/iniciar-sesion">Iniciar Sesión</router-link></li>
            </template>
            <template v-else>
                <li><router-link class="block py-1 px-2" to="/chat">Chat</router-link></li>
                <li><router-link class="block py-1 px-2" to="/mi-perfil">Mi Perfil</router-link></li>
                <li>
                    <form 
                        action="#"
                        @submit.prevent="handleLogout"
                    >
                        <button type="submit" class="flex gap-2 items-center py-1 px-2" to="/iniciar-sesion">
                            <img 
                                v-if="loggedUser.photoURL"
                                :src="loggedUser.photoURL"
                                alt=""
                                class="w-8 rounded-full"
                            >
                            <span>{{ loggedUser.email }} (Cerrar Sesión)</span>
                        </button>
                    </form>
                </li>
            </template>
        </ul>
    </nav>
    <main class="container p-4 mx-auto">
        <router-view />
    </main>
    <!-- 
    Si bien Tailwind tiene muchos estilos por defecto, va a inevitablemente
    ocurrir que necesitemos poner valor que el framework no contempla.
    Por ejemplo, en nuestro footer, queremos un alto de 100px. Tailwind
    lo más cercano que nos ofrece son 96px.
    Cuando queremos personalizar los estilos, tenemos 3 opciones:
    1. Crear nuestro propio estilo en el CSS. No es la preferida en general.
    2. Podemos usar estilos con valores arbitrarios, con los [].
        Esto es muy útil para cuando tenemos que aplicar valores "one-off".
    3. Agregar el valor a Tailwind en su archivo de configuración.
        Ver [tailwind.config.js] para el ejemplo.
    -->
    <!-- <footer class="flex justify-center items-center h-[6.25rem] bg-slate-900 text-white"> -->
    <footer class="flex justify-center items-center h-25 bg-slate-900 text-white">
        <p>Copyright &copy; Da Vinci 2024</p>
    </footer>
</template>