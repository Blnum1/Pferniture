using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
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

      modelBuilder.Entity<Cart>()
                .HasKey(c => c.CartID);

      modelBuilder.Entity<CartItem>()
          .HasKey(ci => ci.CartItemID);

      modelBuilder.Entity<CartItem>()
          .HasOne(ci => ci.Cart)
          .WithMany(c => c.CartItems)
          .HasForeignKey(ci => ci.CartID);

      modelBuilder.Entity<CartItem>()
          .HasOne(ci => ci.Product)
          .WithMany(p => p.CartItems)
          .HasForeignKey(ci => ci.ProductID);

      modelBuilder.Entity<Order>()
          .HasKey(o => o.OrderID);

      modelBuilder.Entity<Order>()
          .HasOne(o => o.Cart)
          .WithMany(c => c.Orders)
          .HasForeignKey(o => o.CartID);

      modelBuilder.Entity<OrderItem>()
       .HasKey(oi => oi.OrderItemID);

      modelBuilder.Entity<OrderItem>()
          .HasOne(oi => oi.Order)
          .WithMany(o => o.OrderItems)
          .HasForeignKey(oi => oi.OrderID);

      modelBuilder.Entity<OrderItem>()
          .HasOne(oi => oi.Product)
          .WithMany(p => p.OrderItems)
          .HasForeignKey(oi => oi.ProductID);


      modelBuilder.Entity<ShippingInfo>()
          .HasKey(s => s.ShippingInfoID);

      modelBuilder.Entity<User>()
           .HasMany(u => u.ShippingInfos)
           .WithOne(s => s.User)
           .HasForeignKey(s => s.UserID)
           .OnDelete(DeleteBehavior.Cascade);

      modelBuilder.Entity<Order>()
          .HasOne(o => o.ShippingInfo)
          .WithMany()
          .HasForeignKey(o => o.ShippingInfoID)
          .OnDelete(DeleteBehavior.Restrict);

      modelBuilder.Entity<Payment>()
          .HasKey(p => p.PaymentID);

      modelBuilder.Entity<Payment>()
          .HasOne(p => p.Order)
          .WithOne(o => o.Payment)
          .HasForeignKey<Payment>(p => p.OrderID);

      modelBuilder.Entity<Payment>()
          .HasIndex(p => p.OrderID)
          .IsUnique();

      modelBuilder.Entity<ProductDto>().HasNoKey().ToView(null);
      modelBuilder.Entity<ShowOrderDto>().HasNoKey().ToView(null);

    }
  }
}
