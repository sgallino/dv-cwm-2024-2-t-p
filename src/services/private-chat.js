/*
https://firebase.google.com/docs/firestore/manage-data/structure-data?hl=es-419

# Estructura del chat privado en Firestore
Para llevar un registro de las conversaciones privadas entre 2 usuarios (en nuestro caso siempre va a ser entre 2 usuarios)
necesitamos guardar lo siguiente:

- Quiénes conforman la conversación.
- Lista de los mensajes.

Ambos son conjuntos de valores:
- El conjunto de ids de los usuarios que participan (que van a ser 2).
- El conjunto de los mensajes (que pueden ser X).

El link que les adjunté arriba da una introducción a cómo guardar estructuras de datos como estas, definiendo las opciones
que existen.

Leyendo ese documento, podemos ver que para un conjunto de datos pequeño y fijo (como los participantes de cada chat)
es muy práctico usar propiedades del documento con un array o un mapa (objeto).
Mientras que para conjuntos de datos que pueden ser indefinidamente extensos (como nuestros mensajes), las subcolecciones 
se ajustan mejor.

En resumen, la estructura que vamos a buscar generar es la siguiente:
[C] => Collection
[D] => Document

[C] private-chats {
    [D] idChatGenerico {
        users: {
            [idUser1]: true,
            [idUser2]: true,
        }

        [C] messages {
            [D] idMessageGenerico1 {
                user_id: ...,
                text: ...,
                created_at: ...,
            },

            ...
        }
    }

    ...
}

Presten especial atención a que los usuarios los vamos a guardar como un mapa donde las claves van a ser los ids de los
usuarios, y como valor simplemente van a tener "true".
Esto va a simplificar varias de las partes más complejas de resolver este chat privado.
*/

import { DocumentReference, addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

// Creamos una variable de caché para las referencias de los documentos ya obtenidos.
// En este objeto, vamos a guardar el documento de chat privado que ya hayamos creado o
// buscado en esta ejecución.
// Como clave del caché, podemos usar la combinación de los ids de los usuarios que
// participan. Por ejemplo, si tenemos:
//  user1: 'asd'
//  user2: 'zxc',
// La clave del chat haremos que sea 'asd_zxc'.
// Vamos a necesitar tener cuidado en que siempre se cree con el mismo orden de ids.
const chatsCache = {};

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string} Los ids ordenados unidos con un "_".
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join('_');
}

/**
 * 
 * @param {string} key 
 * @param {any} value 
 */
function cacheAdd(key, value) {
    chatsCache[key] = value;
    // console.log("[cache] Agregado al caché: ", key, value);
}

/**
 * 
 * @param {string} key 
 * @returns {any}
 */
function cacheRetrieve(key) {
    // console.log("[cache] Consulta al caché: ", key, chatsCache[key]);
    return chatsCache[key] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getPrivateChatDocument(senderId, receiverId) {
    // Verificamos si ya tenemos en caché este documento, para evitar un viaje innecesario
    // a Firestore.
    const cacheKey = getCacheKey(senderId, receiverId);
    const cacheDoc = cacheRetrieve(cacheKey);

    if(cacheDoc) return cacheDoc;

    // No lo encontramos en el caché, así que lo tenemos que buscar.
    const privateChatRef = collection(db, `private-chats`);

    // console.log("[private-chat.js] Buscando en Firestore el chat privado");
    // Buscamos el documento del chat privado que nos están pidiendo, y si existe, lo
    // retornamos, y sino, lo creamos.

    // Para buscar un documento, vamos a necesitar usar la función query() en conjunto
    // con las funciones where() y limit().
    const privateChatQuery = query(privateChatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }), limit(1));

    // Para usar un query, por más que sea para buscar un único posible resultado, tenemos que
    // usar la función getDocs(), que nos retorna un snapshot con potencialmente un array de
    // documentos.
    const privateChatsSnapshot = await getDocs(privateChatQuery);
    let chatDocument;

    // Preguntamos si el documento no existe.
    if(privateChatsSnapshot.empty) {
        // Guardamos el documento.
        chatDocument = await addDoc(privateChatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            },
        });
    } else {
        // Retornamos el documento que trajimos.
        chatDocument = privateChatsSnapshot.docs[0];
    }

    // Agregamos en el caché el chat, y lo retornamos.
    cacheAdd(cacheKey, chatDocument);
    return chatDocument;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    const privateChatDoc = await getPrivateChatDocument(senderId, receiverId);

    // Ahora que creamos el documento y tenemos sus datos (específicamente, nos interesa el id), procedemos a la creación
    // de la subcolección y el mensaje.
    const messagesRef = collection(db, `private-chats/${privateChatDoc.id}/messages`);

    // Pusheamos el mensaje :D
    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @returns {Promise<import("firebase/auth").Unsubscribe)}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const chatDocument = await getPrivateChatDocument(senderId, receiverId);

    const messagesRef = collection(db, `private-chats/${chatDocument.id}/messages`);

    const messagesQuery = query(messagesRef, orderBy('created_at'));

    return onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(messages);
    });
}