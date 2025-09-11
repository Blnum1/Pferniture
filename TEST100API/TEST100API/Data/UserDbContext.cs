using Microsoft.EntityFrameworkCore;
using TEST100API.Models.Entities;

namespace TEST100API.Data
{
  public class UserDbContext : DbContext
  {
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    
    
  }
}
