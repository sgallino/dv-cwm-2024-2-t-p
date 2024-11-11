/**
 * 
 * @param {Date|null} date 
 * @returns {string|null}
 */
export function formatDate(date) {
    // Si el objeto no es un Date, entonces retornamos null.
    if(!date) return null;

    // Creamos un formateador de fecha internacional, con ayuda de la clase Intl.
    const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
    });
    return formatter.format(date).replace(',', '');
}