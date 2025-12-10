// Importa la clase Router de express para crear rutas modulares
import { Router } from "express";

// Importar funciones de validación de express-validator
import { body, param } from "express-validator";

// Importar el controlador
import controller from "./controller.js";

// Crea una nueva instancia de Router
const routes = Router({ strict: true });


//================ RUTA POST: CREAR NUEVO AVIÓN ===============
routes.post(
    "/create",
    [
        body("id_aerolinea", "El ID de aerolínea es requerido y debe ser numérico")
            .trim()
            .notEmpty()
            .isNumeric()
            .toInt(),

        body("fabricante", "El fabricante es obligatorio")
            .trim()
            .notEmpty()
            .isLength({ max: 30 })
            .withMessage("El fabricante no puede exceder 30 caracteres")
            .escape(),

        body("tipo", "El tipo es obligatorio")
            .trim()
            .notEmpty()
            .isLength({ max: 15 })
            .withMessage("El tipo no puede exceder 15 caracteres")
            .escape(),

        body("capacidad", "La capacidad es requerida y debe ser numérica")
            .trim()
            .notEmpty()
            .isNumeric()
            .toInt()
            .custom((value) => value > 0)
            .withMessage("La capacidad debe ser mayor a 0"),
    ],
    controller.validation,
    controller.create
);


//================ RUTA GET: OBTENER TODOS LOS AVIONES ===============
routes.get("/aviones", controller.show_aviones);


//=============== RUTA GET: OBTENER UN AVIÓN POR ID ===============
routes.get(
    "/avion/:id",
    [
        param("id", "ID de avión inválido")
            .exists()
            .isNumeric()
            .toInt(),
    ],
    controller.validation,
    controller.show_aviones
);


//================== RUTA PUT: EDITAR UN AVIÓN ==================
// ❗ id_avion AHORA VIENE POR URL, NO POR BODY
routes.put(
    "/edit/:id",
    [
        param("id", "ID de avión inválido")
            .exists()
            .isNumeric()
            .toInt(),

        body("id_aerolinea")
            .optional()
            .trim()
            .isNumeric()
            .withMessage("El ID de aerolínea debe ser numérico")
            .toInt(),

        body("fabricante")
            .optional()
            .trim()
            .notEmpty()
            .isLength({ max: 30 })
            .withMessage("El fabricante no puede exceder 30 caracteres")
            .escape(),

        body("tipo")
            .optional()
            .trim()
            .notEmpty()
            .isLength({ max: 15 })
            .withMessage("El tipo no puede exceder 15 caracteres")
            .escape(),

        body("capacidad")
            .optional()
            .trim()
            .isNumeric()
            .toInt()
            .custom((value) => value > 0)
            .withMessage("La capacidad debe ser mayor a 0"),
    ],
    controller.validation,
    controller.edit_avion
);


//=========== RUTA DELETE: ELIMINAR UN AVIÓN ===================
// ❗ También se pasa id_avion por params, NO por body
routes.delete(
    "/delete/:id",
    [
        param("id", "ID de avión inválido")
            .exists()
            .isNumeric()
            .toInt(),
    ],
    controller.validation,
    controller.delete_avion
);


// Exporta las rutas
export default routes;
