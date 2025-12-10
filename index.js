//Importar el modulo 'express' -Freamwork web para Node.js
//Express proporciona herramientas para crear servidores HTTP
import express from "express";

//Importar el archivo 'routes.js' que contirnr las rutas de la aplicacion
//Las rutas definen que sucedde cuando el cliente accede a diferentes URLs
import routes from "./routes.js";

//Crear una instancia de la aplicacion Express
//Esta instancia es el objeto principal que configuremos  y ejecutemos 
const app = express();

//Define el numero del puerto en el que escuchara el servidor
//El puerto 3000 es un puerto comun para desarrollo local
const port = 3000;

//Middlare que permite a Express parsear (Interpretar) datos JSON en las peticiones 
//Sin esto, los datos JSON del cliente no seria accesible en req.body
app.use(express.json());

//Utilizamos el archivo de rutas importado
//Todas las rutas definidas en 'routes.js' estaran disponibles en este servidor
app.use(routes);

//Middlleware de manejo de errores - se ejecuta cuando ocurre un error en cualquier ruta
//Los parametros (err, req, res, next) son abligatorios para indentificarlos como manejo de errores
app.use((err, req, res, next) => {

    //Asinga un codigo de estado HTPP al error (500 = Error Interno del Servidor por defecto)
    //Si el error ya tiene un statusCode, lo mantiene; si no, asigna 500
    err.statusCode = err.statusCode || 500;

    //Asigna un mensaje al error (mensaje generico por defecto)
    //Si el error no tiene mensaje, asigna uno predeterminado
    err.message = err.message || "Error interno del servidor";

    //Envia una respuesta HTTP al cliente con el codigo de estado del error
    //incluye un objeto JSON con el mensaje del error
    res.status(err.statusCode).json({
        message: err.message,
    });
});

//Inicia el servidor para que escuche conexiones entrantes en el puerto definido
//El callback se ejecuta cuando el servidor esta listo
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
