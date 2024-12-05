const db = require('../config/database');
const responseformat = require('../utils/responseformat');

const clienteController = {
    //mostrar todos los clientes
    getAll: (req, res) => {
        const query = 'SELECT * FROM Cliente';
        db.all(query, [],(err, rows) =>{
            if(err){
                return res.status(500).send(responseformat(false, 'Error Traer datos', [], []));
            }
            if(rows.length > 0 ){
                return res.status(200).send(responseformat(true, '', [], rows));
            }else{
                return res.status(404).send(responseformat(false, 'No se encontro clientes registrados', [], []));
            }
        });
    },
    //buscar un cliente
    getById: (req,res) => {
        const {id} = req.params;
        console.log("id: " + id);
        const query = 'SELECT * FROM Cliente WHERE ClienteId = ?';
        const idRegex = /^[1-9][0-9]*$/;   //regex para verificar que sea numero excepto 0
        if (idRegex.test(id)) {
            db.get(query, [id],(err, row) =>{
                if(err){
                    return res.status(500).send(responseformat(false, 'Error Traer datos', [], []));
                }
                if(row){
                    console.log("cliente: " + row);
                    return res.status(200).send(responseformat(true, 'Cliente encontrado', [], row));
                }else{
                    return res.status(404).send(responseformat(false, 'Cliente no encontrado', [], []));
                }
            });
        }else{
            return res.status(400).send(responseformat(false, 'Dato no valido', [], []));
        }
    },
    create: (req, res) => {
        const {ClienteId, Nombre, Identidad} = req.body;
        //validar que clienteid este seteado a 0
        if(!Nombre || !Identidad || !ClienteId){
            return res.status(400).send(responseformat(false, 'Error por falta de datos', [], []));
        }else{
            if(ClienteId != 0){
                return res.status(400).send(responseformat(false, 'ClienteId debe estar en 0', [], []));
            }else{
                //verificar si ya existe la identidad a ingresar
                const newidentidad = 'SELECT * FROM Cliente WHERE Identidad = ?';
                db.get(newidentidad, [Identidad], (err, row) => {
                    if (err) {
                        return res.status(500).send(responseformat(false, 'Error en verificar identidad', [], []));
                    }
                    if(row){
                        return res.status(409).send(responseformat(false, 'Identidad ya registrada', [], []));
                    }else{
                        //Identidad no registrada proceder creacion de cliente
                        const query = 'INSERT INTO Cliente (Nombre,Identidad) VALUES (?,?)';
                        db.run(query,[Nombre,Identidad], function (err) {
                            if(err){
                                return res.status(500).send(responseformat(false,'Error al crear cliente',[err],[]));
                            } else{
                                const newCliente = {
                                    ClienteId: this.lastID,
                                    Nombre: Nombre,
                                    Identidad: Identidad,
                                };
                                return res.status(201).send(responseformat(true,'Cliente Creado',[],newCliente));
                            }
                        });
                    }
                });
            }
        }
    },
    update: (req,res) => {
        const {ClienteId, Nombre, Identidad} = req.body;
        //validar clienteid
        const idRegex = /^[1-9][0-9]*$/;   //regex para verificar que sea numero excepto 0
        if(!Nombre || !Identidad){
            return res.status(400).send(responseformat(false, 'Error por falta de datos', [], []));
        }else{
            if (idRegex.test(ClienteId)) {
                //Verificar identidad si existe en otro cliente
                const verificaridentidad = 'SELECT * FROM Cliente WHERE Identidad = ? AND ClienteId != ?';
                db.get(verificaridentidad, [Identidad,ClienteId], (err, row) => {
                    if (err) {
                        return res.status(500).send(responseformat(false, 'Error en verificar identidad', [], []));
                    }
                    if(row){
                        return res.status(409).send(responseformat(false, 'Identidad ya registrada', [], []));
                    }else{
                        //actualizar datos si no existe identidad nueva o es la misma
                        const updatecliente = 'UPDATE Cliente SET Nombre = ?, Identidad = ? WHERE ClienteId = ?';
                        db.run(updatecliente,[Nombre,Identidad,ClienteId], function (err) {
                            if(err){
                                return res.status(500).send(responseformat(false,'Error al actualizar cliente',[err],[]));
                            }
                            if (this.changes === 0) {
                                return res.status(404).send(
                                    responseformat(false, 'Cliente no encontrado', [], [])
                                );
                            } else{
                                const updateCliente = {
                                    ClienteId: ClienteId,
                                    Nombre: Nombre,
                                    Identidad: Identidad,
                                };
                                return res.status(200).send(responseformat(true,'Cliente Actualizado',[],updateCliente));
                            }
                        });
                    }
                });
                }else{
                    return res.status(400).send(responseformat(false, 'El ClienteId no puede ser 0', [], []));
                }
            }
        }
    };

module.exports = clienteController;
