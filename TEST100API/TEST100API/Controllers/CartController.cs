using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TEST100API.Data;
using TEST100API.Models.Entities;

[Route("api/[controller]")]
[ApiController]
public class CartController : ControllerBase
{
  private readonly IConfiguration _config;
  private readonly AppDbContext _context;

  public CartController(IConfiguration config, AppDbContext context)
  {
    _config = config;
    _context = context;
  }

  [AllowAnonymous]
  [HttpPost("CreateCart")]
  public IActionResult CreateCart([FromBody] Cart cart)
  {
    if (cart.UserID == 0)
    {
      return BadRequest("UserID is required.");
    }

    _context.Carts.Add(cart);
    _context.SaveChanges();  

    return Ok("Cart created successfully.");
  }

  [HttpPost("AddItemToCart")]
  public IActionResult AddItemToCart([FromBody] CartItem cartItem)
  {
    var cart = _context.Carts.FirstOrDefault(c => c.CartID == cartItem.CartID);
    if (cart == null)
    {
      return NotFound("Cart not found.");
    }

    var product = _context.Products.FirstOrDefault(p => p.ProductID == cartItem.ProductID);
    if (product == null)
    {
      return NotFound("Product not found.");
    }

    cartItem.PriceAmount = product.Price.Value * cartItem.Quantity;

    _context.CartItems.Add(cartItem);
    _context.SaveChanges();  
    return Ok("Item added to cart.");
  }
}
