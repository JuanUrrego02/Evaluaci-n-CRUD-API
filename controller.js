import { validationResult, matchedData } from "express-validator";
import DB from './database.js';

const validation_result = validationResult.withDefaults({
    formatter: (error) => {
        return error.msg;
    }
});

class Controller {
    // MIDDLEWARE PARA VALIDAR LOS DATOS DE ENTRADA
    static validation = (req, res, next) => {
        const errors = validation_result(req).mapped();
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                ok: 0,
                status: 422,
                errors,
            });
        }
        next();
    }

    // CREAR UN NUEVO AVIÓN (id_avion es AUTO_INCREMENT)
    static create = async (req, res, next) => {
        const { id_aerolinea, fabricante, tipo, capacidad } = matchedData(req);
        try {
            const [result] = await DB.execute(
                "INSERT INTO avion (id_aerolinea, fabricante, tipo, capacidad) VALUES (?, ?, ?, ?)",
                [id_aerolinea, fabricante, tipo, capacidad]
            );
            res.status(201).json({
                ok: 1,
                status: 201,
                message: "Avión fue creado de manera exitosa",
                avion_id: result.insertId,
            });
        } catch (e) {
            next(e);
        }
    }

    // OBTENER AVIONES (todos o uno específico)
    static show_aviones = async (req, res, next) => {
        try {
            let sql = "SELECT * FROM avion";
            if (req.params.id) {
                sql = "SELECT * FROM avion WHERE id_avion = ?";
            }
            const [row] = await DB.query(sql, req.params.id ? [req.params.id] : []);
            
            if (row.length === 0 && req.params.id) {
                return res.status(404).json({
                    ok: 0,
                    status: 404,
                    message: "ID de avión inválido",
                });
            }
            
            const avion = req.params.id ? { avion: row[0] } : { aviones: row };
            res.status(200).json({
                ok: 1,
                status: 200,
                ...avion,
            });
        } catch (e) {
            next(e);
        }
    }

    // EDITAR UN AVIÓN EXISTENTE (id por URL, no por body)
    static edit_avion = async (req, res, next) => {
        try {
            const id_avion = req.params.id;  // <-- YA NO VIENE DEL BODY
            const data = matchedData(req);   // <-- NO trae id_avion

            const [row] = await DB.query("SELECT * FROM avion WHERE id_avion = ?", [
                id_avion,
            ]);
            
            if (row.length !== 1) {
                return res.json({
                    ok: 0,
                    status: 404,
                    message: "ID del avión es inválido"
                });
            }
            
            const avion = row[0];
            
            // Mantener valores existentes si no se proporcionan nuevos
            const id_aerolinea = data.id_aerolinea || avion.id_aerolinea;
            const fabricante = data.fabricante || avion.fabricante;
            const tipo = data.tipo || avion.tipo;
            const capacidad = data.capacidad || avion.capacidad;

            await DB.execute(
                "UPDATE avion SET id_aerolinea=?, fabricante=?, tipo=?, capacidad=? WHERE id_avion=?",
                [id_aerolinea, fabricante, tipo, capacidad, id_avion]
            );

            res.json({
                ok: 1,
                status: 200,
                message: "Avión fue actualizado de manera exitosa",
            });
        } catch (e) {
            next(e);
        }
    }

    // ELIMINAR UN AVIÓN (id por URL)
    static delete_avion = async (req, res, next) => {
        try {
            const id_avion = req.params.id;
            const [result] = await DB.execute(
                "DELETE FROM avion WHERE id_avion=?",
                [id_avion]
            );

            if (result.affectedRows > 0) {
                return res.json({
                    ok: 1,
                    status: 200,
                    message: "Avión fue eliminado de manera exitosa",
                });
            }

            return res.json({
                ok: 0,
                status: 404,
                message: "ID de avión inválido",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default Controller;
