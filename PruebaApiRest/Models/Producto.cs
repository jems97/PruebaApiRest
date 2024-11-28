namespace PruebaApiRest.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public required string Nombre { get; set; }
        public required string Descripcion{ get; set; }
        public required decimal Precio { get; set; }
        public required int Existencia { get; set; }
    }
}
