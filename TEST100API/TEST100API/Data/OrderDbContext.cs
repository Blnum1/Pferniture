using Microsoft.EntityFrameworkCore;
using TEST100API.Models.Entities;

namespace TEST100API.Data
{
  public class OrderDbContext : DbContext
  {
    public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<ShippingInfo> ShippingInfos => Set<ShippingInfo>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Order>().HasKey(o => o.OrderID);

      modelBuilder.Entity<Order>()
        .HasOne(o => o.Product)
        .WithMany()
        .HasForeignKey(o => o.ProductID)
        .OnDelete(DeleteBehavior.SetNull);

      modelBuilder.Entity<ShippingInfo>().HasKey(s => s.ShippingInfoID);
      modelBuilder.Entity<ShippingInfo>()
        .HasOne(s => s.Order)
        .WithOne(o => o.ShippingInfo)
        .HasForeignKey<ShippingInfo>(s => s.OrderID)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<Payment>().HasKey(p => p.PaymentID);
      modelBuilder.Entity<Payment>()
        .Property(p => p.Payment_Amount)
        .HasColumnType("decimal(18,2)");

      modelBuilder.Entity<Payment>()
        .HasOne(p => p.Order)
        .WithOne(o => o.Payment)
        .HasForeignKey<Payment>(p => p.OrderID)
        .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Ignore<Product>();
      modelBuilder.Ignore<User>();
    }
  }
}
