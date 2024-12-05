const db = require('../config/database');
const responseformat = require('../utils/responseformat');

const productoController = {
    //mostrar todos los productos
    getAll: (req, res) => {
        const query = 'SELECT * FROM Producto';
        db.all(query, [],(err, rows) =>{
            if(err){
                return res.status(500).send(responseformat(false, 'Error Traer datos', [], []));
            }
            if(rows.length > 0 ){
                return res.status(200).send(responseformat(true, '', [], rows));
            }else{
                return res.status(404).send(responseformat(false, 'No se encontro Producto Registrado', [], []));
            }
        });
    },
    //buscar un producto
    getById: (req,res) => {
        const {id} = req.params;
        console.log("id: " + id);
        const query = 'SELECT * FROM Producto WHERE ProductoId = ?';
        const idRegex = /^[1-9][0-9]*$/;   //regex para verificar que sea numero excepto 0
        if (idRegex.test(id)) {
            db.get(query, [id],(err, row) =>{
                if(err){
                    return res.status(500).send(responseformat(false, 'Error Traer datos', [], []));
                }
                if(row){
                    return res.status(200).send(responseformat(true, 'Producto encontrado', [], row));
                }else{
                    return res.status(404).send(responseformat(false, 'Producto no encontrado', [], []));
                }
            });
        }else{
            return res.status(400).send(responseformat(false, 'Dato no valido', [], []));
        }
    },
    create: (req, res) => {
        const {ProductoId, Nombre, Descripcion,Precio,Existencia} = req.body;
        //validar que productoid este seteado a 0
        if(!Nombre || !Descripcion || !Precio || !Precio || !Existencia){
            return res.status(400).send(responseformat(false, 'Error por falta de datos', [], []));
        }else{
            if(ProductoId != 0){
                return res.status(400).send(responseformat(false, 'ProductoId debe estar en 0', [], []));
            }else{
                //Guardar producto
                const query = 'INSERT INTO Producto (Nombre, Descripcion,Precio,Existencia) VALUES (?,?,?,?)';
                db.run(query,[Nombre, Descripcion,Precio,Existencia], function (err) {
                    if(err){
                        return res.status(500).send(responseformat(false,'Error al crear Producto',[err],[]));
                    } else{
                        const newProduct = {
                            ProductoId: this.lastID,
                            Nombre: Nombre,
                            Descripcion: Descripcion,
                            Precio: Precio,
                            Existencia: Existencia
                        };
                        return res.status(201).send(responseformat(true,'Producto Creado',[],newProduct));
                    }
                });
            }
        }
    },
    update: (req,res) => {
        const {ProductoId, Nombre, Descripcion,Precio,Existencia} = req.body;
        //validar productoid
        const idRegex = /^[1-9][0-9]*$/;   //regex para verificar que sea numero excepto 0
        if(!Nombre || !Descripcion || !Precio || !Precio || !Existencia){
            return res.status(400).send(responseformat(false, 'Error por falta de datos', [], []));
        }else{
            if (idRegex.test(ProductoId)) {
                //actualizar datos de producto
                const updateProducto = 'UPDATE Producto SET Nombre = ?, Descripcion = ?,Precio = ?,Existencia = ? WHERE ProductoId = ?';
                db.run(updateProducto,[Nombre, Descripcion,Precio,Existencia,ProductoId], function (err) {
                    if(err){
                        return res.status(500).send(responseformat(false,'Error al actualizar producto',[err],[]));
                    }
                    if (this.changes === 0) {
                        return res.status(404).send(
                            responseformat(false, 'producto no encontrado', [], [])
                        );
                    } else{
                        const updateProduct = {
                            ProductoId: this.lastID,
                            Nombre: Nombre,
                            Descripcion: Descripcion,
                            Precio: Precio,
                            Existencia: Existencia
                        };
                        return res.status(200).send(responseformat(true,'Producto Actualizado',[],updateProduct));
                    }
                });
            }else{
                return res.status(400).send(responseformat(false, 'El ProductoId no puede ser 0', [], []));
            }
        }
    }
};

module.exports = productoController;
