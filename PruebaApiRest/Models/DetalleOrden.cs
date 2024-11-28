namespace PruebaApiRest.Models
{
    public class DetalleOrden
    {
        public int DetalleOrdenId { get; set; }
        public required int OrdenId { get; set; }
        public required int ProductoId { get; set; }
        public required decimal Cantidad { get; set; }
        public required decimal Impuesto { get; set; }
        public required decimal Subtotal { get; set; }
        public required decimal Total { get; set; }
    }
}
