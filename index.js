const express = require('express')
const clienteRoutes = require('./routes/clienteRoutes')
const productoRoutes = require('./routes/productoRoutes')
const ordenesRoutes = require('./routes/ordenesRoutes')
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ordenes', ordenesRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})