<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfilePhoto } from '../services/auth'

export default {
    name: 'MyProfileEditPhoto',
    components: { BaseHeading1, },
    data() {
        return {
            editing: false,
            editData: {
                photo: null,
                // photoPreview lo vamos a usar para mostrar una previsualización de la imagen
                // cuando el usuario la seleccione.
                photoPreview: null,
            },

            feedback: {
                text: null,
                type: null,
            },
        }
    },
    methods: {
        async handleSubmit() {
            // Agregamos una "guard clause" que evite que envíen múltiples peticiones juntas.
            if(this.editing) return;

            // Agregamos que no se pueda grabar si no eligieron una foto.
            // TODO: Mostrar algún mensaje de feedback.
            if(this.editData.photo == null) {
                this.feedback = {
                    text: 'Tenés que elegir una foto para actualizar tu perfil.',
                    type: 'error',
                }
                return;
            }

            this.editing = true;

            try {
                await editMyProfilePhoto(this.editData.photo);
                
                this.feedback = {
                    text: '¡Tu foto de perfil fue actualizada con éxito!',
                    type: 'success',
                }
            } catch (error) {
                // TODO: Personalizar mejor el mensaje de error según el problema ocurrido.
                this.feedback = {
                    text: 'Ocurrió un error y la foto no pudo ser actualizada.',
                    type: 'error',
                }
            }

            this.editing = false;
        },

        // Capturamos el objeto Event en la variable "ev".
        // Este objeto contiene mucha información sobre el evento ocurrido: El tipo de evento,
        // las coordenadas del mouse si fue un evento de click, la tecla apretada si fue un
        // evento de teclado, si ocurrió en la etapa de captura o burbuja, etc.
        // Entre esos datos, está la propiedad "target" que nos retorna el elemento HTML
        // que disparó el evento.
        handleFileSelection(ev) {
            // Los inputs de tipo "file" tienen una propiedad llamada "files" que retorna
            // un FileList. FileList es una clase que representa básicamente un array de 
            // objetos File.
            // console.log("El target del evento es: ", ev.target);
            // console.log("Imagen cambiada. La propiedad files es: ", ev.target.files);

            // Como el input no tiene el atributo "multiple", el usuario solo puede elegir un
            // único archivo. Por lo tanto, podemos hard-codear la lectura de la posición 0.
            this.editData.photo = ev.target.files[0] || null;

            // Agregamos una "guard clause" que solo proceda con la previsualización si tenemos
            // una foto.
            if(!this.editData.photo) {
                this.editData.photoPreview = null;
                return;
            }

            // Para poder agregar la previsualización de la imagen, vamos a necesitar leer el
            // contenido del archivo.
            // Los archivos en JS se leen con una clase FileReader.
            const reader = new FileReader();

            // Configuramos lo que queremos hacer cuando FileReader termine de leer el archivo
            // que le pidamos usando un evento.
            reader.addEventListener('load', () => {
                // Usamos la propiedad "result" del FileReader para obtener lo leído.
                // console.log(reader.result);
                this.editData.photoPreview = reader.result;
            });

            // Habiendo configurado el evento 'load', le pedimos el archivo que queremos que
            // lea, y el formato en que queremos el contenido.
            reader.readAsDataURL(this.editData.photo);
        },
    }
}
</script>

<template>
    <BaseHeading1>Cambiar mi Foto de Perfil</BaseHeading1>

    <div 
        v-if="feedback.text"
        class="p-4 mb-4 rounded"
        :class="{
            'bg-green-200': feedback.type == 'success',
            'bg-red-200': feedback.type == 'error',
        }"
    >{{ feedback.text }}</div>

    <div class="flex gap-4 items-start">
        <form 
            class="w-1/2"
            action="#"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label 
                    for="photoURL"
                    class="block mb-2"
                >Nueva Foto</label>
                <input
                    type="file"
                    id="photoURL"
                    class="w-full p-2 border rounded"
                    :class="{'bg-gray-200': editing}"
                    @change="handleFileSelection"
                >
            </div>
            <button 
                type="submit"
                class="transition-all py-2 px-4 rounded bg-blue-700 text-white focus:bg-blue-500 hover:bg-blue-500 active:bg-blue-900"
            >
                {{ !editing ? 'Actualizar mi Foto de Perfil' : 'Actualizando...' }}
            </button>
        </form>
        <div>
            <h2>Previsualización de la Foto Elegida</h2>
            <img 
                v-if="editData.photoPreview !== null"
                :src="editData.photoPreview"
                alt=""
            >
        </div>
    </div>
</template>