const db = require('../config/database');
const responseformat = require('../utils/responseformat');

const ordenesController = {
    create: async (req, res) => {
        const { OrdenId, ClienteId, Detalle } = req.body;
        const detalleValues = [];  //para sacar ya calculadas los precioy guardar cada producto
        let Impuesto = 0.00;
        let Subtotal = 0;
        let Total = 0;


        const idRegex = /^[1-9][0-9]*$/;   //regex para verificar que sea numero excepto 0
        if (!ClienteId) {
            return res.status(400).send(responseformat(false, 'Error por falta de datos', [], []));
        } else {
            if (OrdenId != 0) {//validar que ordenid este seteado a 0
                return res.status(400).send(responseformat(false, 'OrdenIDdebe estar en 0', [], []));
            } else {
                //verificar que el cliente exista
                if (idRegex.test(ClienteId)) {
                    const cliente = await new Promise((resolve, reject) => {
                        const query = 'SELECT * FROM Cliente WHERE ClienteId = ?';
                        db.get(query, [ClienteId], (err, row) => {
                            if (err) return reject(err);
                            resolve(row);
                        });
                    });
                    if (!cliente) {
                        return res.status(404).send(responseformat(false, 'Cliente no encontrado', [], []));
                    }


                    for (let detalle of Detalle) {
                        const { ProductoId, Cantidad } = detalle

                        let precioProducto = 0;

                        //verificar si producto existe
                        const producto = await new Promise((resolve, reject) => {
                            const query = 'SELECT * FROM Producto WHERE ProductoId = ?';
                            db.get(query, [ProductoId], (err, row) => {
                                if (err) return reject(err);
                                resolve(row);
                            });
                        });

                        if (!producto) {
                            return res.status(404).send(
                                responseformat(false, "Producto no encontrado", [], [])
                            );
                        }

                        //calcular los precios para guardarlos despues cada una de los productos en detalleordenes
                        precioProducto = producto.Precio;
                        console.log("PrecioP:" + precioProducto)
                        const impuestoproducto = (Cantidad * precioProducto) * 0.15;
                        const subtotalproducto = (Cantidad * precioProducto);
                        const totalproducto = (impuestoproducto + subtotalproducto);

                        detalleValues.push({
                            ProductoId,
                            Cantidad,
                            Impuesto: parseFloat(impuestoproducto.toFixed(2)),
                            Subtotal: parseFloat(subtotalproducto.toFixed(2)),
                            Total: parseFloat(totalproducto.toFixed(2))
                        });

                        Impuesto += parseFloat(impuestoproducto.toFixed(2));
                        Subtotal += parseFloat(subtotalproducto.toFixed(2));
                        Total += parseFloat(totalproducto.toFixed(2));

                        console.log("Productoid:" + ProductoId + "|Cantidad:" + Cantidad);

                    };

                    Impuesto = parseFloat(Impuesto.toFixed(2));
                    Subtotal = parseFloat(Subtotal.toFixed(2));
                    Total = parseFloat(Total.toFixed(2));

                    console.log("DetalleValues:" + detalleValues);
                    console.log("impuesto:" + Impuesto + "|Subtotal:" + Subtotal + "|Total:" + Total);

                    //Guardar orden completa
                    const newOrderId = await new Promise((resolve, reject) => {
                        const query = 'INSERT INTO Orden (ClienteId, Impuesto, Subtotal, Total) VALUES (?, ?, ?, ?)';
                        db.run(query, [ClienteId, Impuesto, Subtotal, Total], function (err) {
                            if (err) return reject(err);
                            resolve(this.lastID);
                        });
                    });

                    console.log("ORderID create:" + newOrderId)

                    //Guardar detalleorden de cada producto
                    const detalleordeninfo = [];
                    for (const detalle of detalleValues) {
                        const { ProductoId, Cantidad, Impuesto, Subtotal, Total } = detalle;
                        const DetalleOrdenId = await new Promise((resolve, reject) => {
                            const query =
                                'INSERT INTO DetalleOrden (OrdenId, ProductoId, Cantidad, Impuesto, Subtotal, Total) VALUES (?, ?, ?, ?, ?, ?)';
                            db.run(query, [newOrderId, ProductoId, Cantidad, Impuesto, Subtotal, Total], (err) => {
                                if (err) return reject(err);
                                resolve(this.lastID);
                            });
                        });

                        detalleordeninfo.push({
                            DetalleOrdenId,
                            OrdenId: newOrderId,
                            ProductoId,
                            Cantidad,
                            Impuesto,
                            Subtotal,
                            Total,
                        });
                    }
                    //enviar los datos
                    const newOrder = {
                        OrdenId: newOrderId,
                        ClienteId,
                        Impuesto,
                        Subtotal,
                        Total,
                        Detalle: detalleordeninfo,
                    };
                    console.log("newOrder:" + newOrder);
                    return res.status(201).send(responseformat(true, 'Orden Creada', [], newOrder));

                } else {
                    return res.status(400).send(responseformat(false, 'Dato no valido', [], []));
                }
            }
        }
    },

};

module.exports = ordenesController;
