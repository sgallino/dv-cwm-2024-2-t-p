// Archivo de creación y configuración del Vue Router.
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { subscribeToAuthState } from "../services/auth";
import Home from "../pages/Home.vue";
import Chat from "../pages/Chat.vue";
import Register from "../pages/Register.vue";
import Login from "../pages/Login.vue";
import MyProfile from "../pages/MyProfile.vue";
import MyProfileEdit from "../pages/MyProfileEdit.vue";
import MyProfileEditPhoto from "../pages/MyProfileEditPhoto.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateChat from "../pages/PrivateChat.vue";

// Definimos nuestro array de rutas.
// Recordamos, cada ruta se registra como un objeto con las propiedades.
// Al menos, debe tener "path" y "component".
const routes = [
    { path: '/',                        component: Home },
    { path: '/registro',                component: Register },
    { path: '/iniciar-sesion',          component: Login },
    { path: '/chat',                    component: Chat,                meta: { requiresAuth: true } },
    { path: '/mi-perfil',               component: MyProfile,           meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar',        component: MyProfileEdit,       meta: { requiresAuth: true } },
    { path: '/mi-perfil/editar/foto',   component: MyProfileEditPhoto,  meta: { requiresAuth: true } },
    { path: '/usuario/:id',             component: UserProfile,         meta: { requiresAuth: true } },
    { path: '/usuario/:id/chat',        component: PrivateChat,         meta: { requiresAuth: true } },
];

// Creamos el router usando las rutas que definimos y definiendo el modo
// de "historia".
const router = createRouter({
    routes,
    // routes: routes,
    history: createWebHashHistory(),
});

// Obtenemos la data del usuario autenticado.
let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
}

subscribeToAuthState(newUserData => loggedUser = newUserData);

// beforeEach define "guard global". Recibe un callback que se ejecuta antes del cambio de
// pantalla en una navegación.
// Este callback recibe, a su vez, dos parámetros: la ruta destino y la ruta origen.
// Si el callback no retorna nada, la navegación se permite normalmente.
// Si retornamos una nueva URL, ya sea como un string o un objeto de ruta, se redirecciona a
// esa pantalla.
// Si retornamos null o false, la navegación simplemente se cancela.
router.beforeEach((to, from) => {
    // Si la ruta requiere autenticación, y el usuario no está autenticado, entonces lo
    // mandamos al login.
    // console.log("Tratando de ingresar a la ruta: ", to.path);
    if(to.meta.requiresAuth && loggedUser.id == null) {
        // console.log("La ruta requiere que el usuario esté autenticado, redireccionando al login.");
        return {
            path: '/iniciar-sesion',
        }
    }
});

// Exportamos el router.
export default router;