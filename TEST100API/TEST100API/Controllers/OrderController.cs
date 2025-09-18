using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TEST100API.Data;
using TEST100API.Models.Entities;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrderController : ControllerBase
  {
    private readonly IConfiguration _config;
    public readonly AppDbContext _context;
    public OrderController(IConfiguration config, AppDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpPost("CreateOrder")]
    public IActionResult Create(Order order)
    {
      order.Order_date = DateTime.Now;
      _context.Orders.Add(order);
      _context.SaveChanges();
      return Ok("Success");
    }
  }
}
