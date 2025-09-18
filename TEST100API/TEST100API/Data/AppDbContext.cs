using Microsoft.EntityFrameworkCore;
using TEST100API.Models.Entities;

namespace TEST100API.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<ShippingInfo> ShippingInfos { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<ProductDto> ProductDto { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<User>().HasKey(u => u.UserID);

      modelBuilder.Entity<Product>().HasKey(p => p.ProductID);
      modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<Product>().Property(p => p.Price_Discount).HasColumnType("decimal(18,2)");

      modelBuilder.Entity<Order>().HasKey(o => o.OrderID);
      modelBuilder.Entity<Order>()
        .HasOne(o => o.User)
        .WithMany(u => u.Orders)
        .HasForeignKey(o => o.UserID)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<Order>()
        .HasOne(o => o.Product)
        .WithMany(p => p.Orders)
        .HasForeignKey(o => o.ProductID)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<ShippingInfo>().HasKey(s => s.ShippingInfoID);
      modelBuilder.Entity<ShippingInfo>()
        .HasOne(s => s.Order)
        .WithOne(o => o.ShippingInfo)
        .HasForeignKey<ShippingInfo>(s => s.OrderID)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<Payment>().HasKey(p => p.PaymentID);
      modelBuilder.Entity<Payment>().Property(p => p.Payment_Amount).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<Payment>()
        .HasOne(p => p.Order)
        .WithOne(o => o.Payment)
        .HasForeignKey<Payment>(p => p.OrderID)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<ProductDto>().HasNoKey().ToView(null);
    }
  }
}
