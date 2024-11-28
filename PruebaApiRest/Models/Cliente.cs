namespace PruebaApiRest.Models
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public required string Nombre { get; set; }
        public required string Identidad { get; set; }
    }
}
