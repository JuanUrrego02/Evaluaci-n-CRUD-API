//Importa el modulo 'Mysql2' que permite conectarse a bases de datos MySQL
// Mysql2 es una librería que proporciona métodos para ejecutar consultas SQL

import mysql from 'mysql2';

//Crear un pool de conexiones a la base de datos MySQL
//Un pool es un conjunto reutilizable de conexiones que mejora el rendimiento
//en lugar de crear una nueva conexión para cada consulta

const pool = mysql.createPool({
    //host: especifica la dirección del servidor de MySQL (localhost = tu máquina local)
    host: 'localhost',
    //user: nombre de usuario para autenticarse en el servidor MySQL
    //"root" es el usuario administrador por defecto
    user: "root",
    //password: contraseña para el usuario especificado (en este caso está vacía)
    //vacía ("") porque no configuraste una contraseña en tu instalación MySQL
    password: "",
    //database: nombre de la base de datos a la que conectarse
    //"bd_api" es la base de datos que contiene las tablas y datos
    database: "db_api"
});

//Exporta la promesa del pool de conexiones
//.promise() convierte los callbacks tradicionales en Promises
//permitiendo código más legible y fácil de mantener
export default pool.promise();
