/*
# Breve Comentario Rutas en Node.js/Vite
Normalmente, sabemos que cuando en una ruta escribimos *solo* la ruta
relativa a un archivo, suele implicar que debe buscar a partir de la
carpeta actual.
Lo mismo significa empezar la ruta con un "./".
Ej:
  'pages/App.vue'
  './pages/App.vue'

En situaciones comunes, esas rutas son equivalentes.
Dicho esto, las rutas en Node.js/Vite no son "situaciones comunes".
Hay una *importante* diferencia entre poner el "./" y no ponerlo.

Si NO ponen:
  - un "./" 
  - un "../" 
  - un "/"
  - una ruta absoluta

Entonces Node.js/Vite entienden que lo que están pidiendo es un paquete
de npm que hayan instalado.
Para referir un archivo, DEBE empezar con alguna de las 4 opciones 
mencionadas.
*/
import './style.css';
import { createApp } from 'vue';
import router from './router/router';
import App from './App.vue';

// Creamos la app de Vue, usando el componente App como raíz.
const app = createApp(App);

app.use(router); // Agregamos el router.

// Montamos el componente en un elemento del HTML.
app.mount('#app');