using Microsoft.EntityFrameworkCore;
using TEST100API.Models.Entities;

namespace TEST100API.Data
{
  public class ProductDbContext : DbContext
  {

    public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductDto> ProductDto { get; set; }

    public DbSet<Category> Categories { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<ProductDto>().HasNoKey().ToView(null);
    }

  }
}
