using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TEST100API.Data;
using TEST100API.Models.Entities;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PaymentController : ControllerBase
  {
    private readonly IConfiguration _config;
    public readonly AppDbContext _context;
    public PaymentController(IConfiguration config, AppDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpPost("CreatePayment")]
    public IActionResult Create(Payment payment)
    {
      payment.Payment_date = DateTime.Now;
      _context.Payments.Add(payment);
      _context.SaveChanges();
      return Ok("Success");
    }
  }
}
