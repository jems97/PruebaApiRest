const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('././ordersdb.db', (err) => {
    if(err){
        console.error(err.message)
    }else{
        console.log("Conectado a la BD");
    }
});

db.serialize(() => {   
    db.run(`
        CREATE TABLE IF NOT EXISTS Cliente (
            ClienteId INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre TEXT NOT NULL,
            Identidad TEXT UNIQUE NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Producto (
            ProductoId INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre TEXT NOT NULL,
            Descripcion TEXT NOT NULL,
            Precio REAL NOT NULL,
            Existencia INTEGER NOT NULL
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Orden (
            OrdenId INTEGER PRIMARY KEY AUTOINCREMENT,
            ClienteId INTEGER NOT NULL,
            Impuesto REAL NOT NULL,
            Subtotal REAL NOT NULL,
            Total REAL NOT NULL,
            FOREIGN KEY (ClienteId) REFERENCES Cliente(ClienteId)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS DetalleOrden (
            DetalleOrdenId INTEGER PRIMARY KEY AUTOINCREMENT,
            OrdenId INTEGER NOT NULL,
            ProductoId INTEGER NOT NULL,
            Cantidad INTEGER NOT NULL,
            Impuesto REAL NOT NULL,
            Subtotal REAL NOT NULL,
            Total REAL NOT NULL,
            FOREIGN KEY (OrdenId) REFERENCES Orden(OrdenId),
            FOREIGN KEY (ProductoId) REFERENCES Producto(ProductoId)
        )
    `);
});

module.exports = db;