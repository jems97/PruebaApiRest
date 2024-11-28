using Microsoft.EntityFrameworkCore;
using PruebaApiRest.Models;

namespace PruebaApiRest.Context
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) 
        { 

        }

        public DbSet<Cliente> Cliente { get; set; }
        public DbSet<Orden> Orden {get; set; }
        public DbSet<DetalleOrden> DetalleOrden { get; set; }
        public DbSet<Producto> Producto { get; set; }
    }
}
