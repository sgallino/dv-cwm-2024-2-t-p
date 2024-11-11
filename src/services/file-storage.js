import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * 
 * @param {string} path 
 * @param {File} file 
 */
export async function uploadFile(path, file) {
    // Así como sucede con Firestore, los archivos de Storage también trabajan con referencias.
    // En este caso, usamos la función "ref" de firebase/storage (no la confundan con la
    // función "ref" de Vue).
    const fileRef = ref(storage, path);

    // uploadBytes permite subir un archivo que tengamos en formato File o Blob.
    await uploadBytes(fileRef, file);
}

/**
 * 
 * @param {string} path 
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);

    // getDownloadURL retorna una URL absoluta al recurso referenciado en Storage, desde donde
    // se puede descargar el archivo.
    return await getDownloadURL(fileRef);
}