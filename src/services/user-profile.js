/*
    Acá manejamos los documentos de la collection "users" que representan y extienden los datos
    de los usuarios de Authentication.
*/
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, bio: string|null, career: string|null, photoURL: string|null}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `users/${id}`);

    const userSnapshot = await getDoc(userRef);

    return {
        id: userSnapshot.id,
        email: userSnapshot.data().email,
        displayName: userSnapshot.data().displayName,
        photoURL: userSnapshot.data().photoURL,
        bio: userSnapshot.data().bio,
        career: userSnapshot.data().career,
    }
}

/**
 * 
 * @param {string} id 
 * @param {{email: string}} data
 * @returns {Promise<void>}
 */
export async function createUserProfile(id, { email }) {
    const userRef = doc(db, `users/${id}`);

    await setDoc(userRef, { email });
}

/**
 * Edita el documento del perfil del usuario.
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data
 * @returns {Promise<void>}
 */
export async function editUserProfile(id, data) {
    // doc() genera la referencia a un documento específico, así como collection() lo hace
    // con una colección.
    const userRef = doc(db, `users/${id}`);

    // Usamos la función updateDoc() para actualizar el documento.
    await updateDoc(userRef, {
        ...data
    });
}