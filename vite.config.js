// Importamos el plugin de @vitejs/plugin-vue
import vue from "@vitejs/plugin-vue";

// El archivo de configuración de Vite siempre debe retornar un objeto
// como default.
export default {
    // Agregamos el plugin de Vue al array de plugins de Vite.
    plugins: [vue()],
}