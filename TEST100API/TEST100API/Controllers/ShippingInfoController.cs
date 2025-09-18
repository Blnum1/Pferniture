using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TEST100API.Data;
using TEST100API.Models.Entities;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ShippingInfoController : ControllerBase
  {
    private readonly IConfiguration _config;
    public readonly AppDbContext _context;
    public ShippingInfoController(IConfiguration config, AppDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpPost("CreateShippingInfo")]
    public IActionResult Create(ShippingInfo shippingInfo)
    {
      _context.ShippingInfos.Add(shippingInfo);
      _context.SaveChanges();
      return Ok("Success");
    }
  }
}
