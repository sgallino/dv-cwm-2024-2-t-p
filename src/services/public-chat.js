// Servicio con las funcionalidades relativas al chat público.
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * 
 * @param {{user_id: string, email: string, text: string}} message
 * @returns {Promise}
 */
// Usando "Object destructuring".
export function saveChatMessage({ user_id, email, text }) {
// export function saveChatMessage(message) {
//     const email = message.email;
//     const text = message.text;

    // Grabamos el mensaje de chat en Firestore.
    // Para cualquier acción que queramos realizar contra Firestore (lectura, escritura),
    // es necesario crear una "referencia" al recurso con el que queremos interactuar.
    // Para definir una referencia usamos la función "collection" de Firestore. Como parámetro,
    // le pasamos la "ruta" al recurso.
    const chatRef = collection(db, 'public-chat');

    // La referencia que acabamos de definir apunta a una collection "public-chat", que
    // es donde vamos a almacenar los mensajes de chat que queremos crear.
    // Sabemos que es una collection porque tiene un único "segmento".
    // Los recursos se escriben con un formato de URL:
    //  nombreCollection/idDocumento/nombreSubcollection/idDocumento/...
    // Con base en esto, podemos deducir que si la URL tiene segmentos impares es una
    // collection, y si son segmentos pares, es un documento.

    // Con la referencia en mano, vamos a finalmente agregar el mensaje del chat.
    // Esto lo hacemos usando la función addDoc(ref, data) de Firestore.
    // Esta función recibe la referencia a una collection, y un objeto con los datos
    // que queremos grabar en el documento.
    // El id del documento generado se va a crear automáticamente.
    // Retorna una promesa que se resuelve al completarse la escritura.
    return addDoc(chatRef, {
        user_id,
        email,
        text,
        // Grabamos la fecha de creacion usando la función de Firestore: 
        //  serverTimestamp().
        // La función serverTimestamp() envía una instrucción a Firestore para que
        // complete su valor usando la fecha y hora del *servidor*. Esto permite
        // que todos los registros que grabemos usen siempre una fuente única para
        // obtener la hora.
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {function} callback - El callback con el código que se quiere ejecutar cada vez 
 *                              que cambien los mensajes. Este callback recibe un array con
 *                              los mensajes como parámetro.
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export function subscribeToChatMessages(callback) {
    // Ahora que el componente se renderiza en el HTML, vamos a pedirle que vaya a traer 
    // los mensajes de chat que tenemos en Firestore.
    // Esto va a requerir:
    //  1. Definir la referencia a la colección.
    //  2. Traer los mensajes.
    //  3. Darle a la data el formato que el componente necesita.
    const chatRef = collection(db, 'public-chat');

    // Obtenemos *todos* los documentos del chat con getDocs.
    // getDocs retorna una Promise que se resuelve con la lista de documentos de la
    // collection (con la clase QuerySnapshot).
    // const snapshot = await getDocs(chatRef);

    // console.log("Los documentos leídos son: ", snapshot);
    // QuerySnapshot tiene una copia de los datos al momento de la lectura. Pero vienen con
    // una estructura propia de Firestore, que la verdad no nos sirve de mucho.
    // Por eso, la vamos a transformar en un array con el formato que queremos.
    // this.messages = snapshot.docs.map(doc => {
    //     return {
    //         id: doc.id,
    //         email: doc.data().email,
    //         text: doc.data().text,
    //     }
    // });

    // La propiedad "docs" del QuerySnapshot nos retorna un array de QueryDocumentSnapshot.
    // DocumentSnapshot es una clase que contiene toda la data del documento. Nuevamente,
    // con un montón de cosas de más que son necesarias para Firestore, pero que a nosotros
    // no nos sirven.
    // Por eso, lo trasformamos usando el método "map" de los arrays de JS para pasarlos
    // a un objeto común.
    // Desde la instancia del documento, con la propiedad "id" obtenemos el id del mismo,
    // y para los datos, los accedemos con el método "data()".

    // Armamos un "query" para indicar ordenamientos o filtros que queremos aplicar para
    // los datos que queremos traer.
    // La función query() crea un query aplicando la collection que le pasamos como
    // primer parámetro con todos los filtros u ordenamientos que pasemos en los
    // siguientes parámetros.
    // orderBy(), por su parte, indica un campo por el que queremos ordenar, y opcionalmente,
    // si es "asc" (default) o "desc".
    const q = query(chatRef, orderBy('created_at'));

    // getDocs() hace una lectura de una única vez.
    // Pero esto es un chat. Queremos actualizaciones en tiempo real. Para esto, vamos a
    // cambiar la función getDocs() por onSnapshot(), que permite "suscribirnos" a los 
    // cambios en los datos de una colección o documento de Firestore.
    // Reemplazamos la collection con el query.
    return onSnapshot(q, snapshot => {
        // Transformamos el snapshot en un array de mensajes.
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                email: doc.data().email,
                text: doc.data().text,
                // Llamamos al método toDate() del Timestamp de Firebase para obtener una representación de la fecha
                // en un objeto Date.
                // ?. => optional chain operator
                created_at: doc.data().created_at?.toDate(),
            }
        });
        // Invocamos el callback que nos pasaron como parámetro y le mandamos los mensajes.
        callback(messages);
    });
}