import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById } from "./user-profile";
import { getFileURL, uploadFile } from "./file-storage";

const FIREBASE_AUTH_ERROR_MAP = {
    'auth/invalid-credential': 'Las credenciales ingresadas no coinciden con nuestros registros.',
    'auth/invalid-email': 'El email debe tener un formato correcto.',
    'auth/weak-password': 'El password debe tener al menos 6 caracteres.',
    'auth/missing-password': 'El password no puede estar vacío.',
    'auth/email-already-in-use': 'Ya existe un usuario con ese email.',
}

let userData = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
    photoURL: null,
}

// Preguntamos si tenemos un usuario almacenado el localStorage. En caso afirmativo, lo
// marcamos como autenticado hasta que Firebas complete la verificación.
if(localStorage.getItem('user')) {
    userData = JSON.parse(localStorage.getItem('user'));
}

// Variable donde almacenar los observers para el estado de autenticación.
let observers = [];

onAuthStateChanged(auth, user => {
    if(user) {
        updateUserData({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });

        // Buscamos los datos del perfil, para actualizar los datos del usuario autenticado.
        getUserProfileById(user.uid)
            .then(profile => {
                updateUserData({
                    bio: profile.bio,
                    career: profile.career,
                });
            });
    } else {
        updateUserData({
            id: null,
            email: null,
            displayName: null,
            bio: null,
            career: null,
            photoURL: null,
        });
        localStorage.removeItem('user');
    }
});

export async function login({email, password}) {
    // Autenticamos usando la función signInWithEmailAndPassword() de Firebase Auth.
    // Esta función recibe 3 parámetros:
    // 1. La referencia a Auth.
    // 2. El email.
    // 3. El password.
    // Retorna una promesa que se resuelve con el objeto UserCredentials.
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        throw FIREBASE_AUTH_ERROR_MAP[error.code] || error.message;
    }
}

/**
 * 
 * @param {{email: string, password: string}} data
 */
export async function register({email, password}) {
    // Para registrar un usuario, necesitamos grabarlo tanto en Authentication como en Firestore.
    // A diferencia de lo que pasó con el editar perfil, acá sí vamos a necesitar hacer las
    // peticiones a Authentication y Firestore en serie, y no en paralelo. La razón es que
    // para crear el documento en Firestore necesitamos tener el id del usuario en Authentication.
    try {
        // Registramos en Authentication...
        const credentials = await createUserWithEmailAndPassword(auth, email, password);

        // Y creamos el perfil...
        await createUserProfile(credentials.user.uid, {email});
    } catch (error) {
        console.error('[auth.js register] Error al registrar el usuario: ', error);
        throw FIREBASE_AUTH_ERROR_MAP[error.code] || error.message;            
    }
}

/**
 * 
 * @param {{displayName: string, bio: string, career: string}} data
 * @return {Promise<void>}
 */
export async function editMyProfile({displayName, bio, career}) {
    try {
        // auth.currentUser => Retorna el objeto User de Firebase Auth con el usuario autenticado.
        const promiseAuth = updateProfile(auth.currentUser, {displayName});

        // Actualizamos el perfil del usuario en Firestore.
        const promiseProfile = editUserProfile(userData.id, {displayName, bio, career});

        // Esperamos a que ambas promesas se completen.
        await Promise.all([promiseAuth, promiseProfile]);

        // Para que los cambios se vean reflejados, actualizamos la info de userData con los
        // nuevos datos, y notificamos a los observers.
        updateUserData({
            displayName,
            bio,
            career,
        });
    } catch (error) {
        console.error('[auth.js editMyProfile] Error al editar los datos del perfil: ', error);
        throw error;
    }
}

/**
 * 
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {
        // Creamos el nombre del recurso que queremos crear.
        // Dentro de Storage, vamos a crear una carpeta "users" donde se van a guardar carpetas
        // para cada usuario, que van a estar identificadas por el id del usuario.
        // La idea es que un usuario solo va a poder grabar archivos en su correspondiente
        // carpeta.
        // TODO: Contemplar otras extensiones aparte de "jpg".
        const filepath = `users/${userData.id}/avatar.jpg`;

        // Subimos el archivo a Storage.
        await uploadFile(filepath, photo);

        // Obtenemos la URL pública desde donde podemos descargar la imagen para poder
        // grabarla en Authentication y Firestore.
        const photoURL = await getFileURL(filepath);

        // Grabamos.
        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(userData.id, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateUserData({
            photoURL,
        });
    } catch (error) {
        console.error('[auth.js editMyProfilePhoto] Error al editar la foto del perfil: ', error);
        throw error;
    }
}

export async function logout() {
    return signOut(auth);
}

/*--------------------------------------------------------------
| Patrón de Diseño: Observer
+---------------------------------------------------------------
| El patrón Observer permitir definir una relación de 1 a muchos
| entre elementos del sistema.
| Específicamente, define un sujeto ("Subject") que es de interés
| de muchos otros saber cada vez que cambia.
| Esos "muchos" interesados en saber cómo cambia van a poder 
| "observar" al sujeto, para que éste les informe cada vez que
| cambie su estado.
| Para ser "notificados" de estos cambios, los "observers" deben
| pedirle al sujeto que los notifique. Este proceso se suele hacer
| pasando un objeto o callback que el sujeto ejecute cada vez que
| cambia.
| Este proceso de pasar el objeto o callback a ejecutar se lo 
| suele llamar "subscribe", "attach", "listen".
|
| En resumen, para implementar Observer necesitamos:
| - Un elemento que sea de interés cuando cambie o suceda (el
    "sujeto").
| - El sujeto debe ofrecer un mecanismo de suscripción para
    "observers".
| - El sujeto debe notificar a los observers cada vez que ocurra
    un cambio.
| - Los observers deben proveer un objeto o callback para ejecutar.
+---------------------------------------------------------------*/
/**
 * Agrega un observer para ser notificado de los cambios en el
 * estado de autenticación.
 * Retorna una función para cancelar la suscripción.
 * 
 * @param {Function} callback
 * @returns {Function}
 */
export function subscribeToAuthState(callback) {
    observers.push(callback);

    // console.log('Observer agregado. El stack actual es: ', observers);

    // Notificamos inmediatamente al callback del estado actual.
    notify(callback);

    return () => observers = observers.filter(obs => obs != callback);
}

/**
 * Notifica a un observer de los datos actuales de la autenticación.
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    // Invocamos el callback y le pasamos una copia de los datos
    // de la autenticación.
    /*
    Si:
        userData = {
            id: 'a',
            email: 'b',
        }

    Entonces escribir:

        const nuevoObjeto = {...userData}

    Es igual a escribir:

        const nuevoObjeto = {id: userData.id, email: userData.email}

    Es decir, el "object spread operator" (operador de esparcimiento de objetos)
    sirve para copiar todas las propiedades de un objeto en otro.
    */

    // console.log('Notificando a un observer...');
    callback({...userData});
}

/**
 * Recorre todos los observers y los notifica.
 */
function notifyAll() {
    observers.forEach(observer => notify(observer));
}

/**
 * Actualiza los datos del usuario autenticado.
 */
function updateUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    }
    localStorage.setItem('user', JSON.stringify(userData));
    notifyAll();
}