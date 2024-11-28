namespace PruebaApiRest.Models
{
    public class Orden
    {
        public int OrdenId { get; set; }
        public required int ClienteId { get; set; }
        public required decimal Impuesto { get; set; }
        public required decimal Subtotal { get; set; }
        public required decimal Total { get; set; }
    }
}
