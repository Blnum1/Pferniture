using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;

[Route("api/[controller]")]
[ApiController]
public class CartController : ControllerBase
{
  private readonly AppDbContext _context;

  public CartController(AppDbContext context)
  {
    _context = context;
  }

  // ---------- 1) สร้างตะกร้าใหม่แบบปกติ (ถ้าจำเป็นต้องมี) ----------
  [AllowAnonymous]
  [HttpPost("CreateCart")]
  public async Task<IActionResult> CreateCart([FromBody] Cart cart)
  {
    if (cart == null || cart.UserID <= 0) return BadRequest("UserID is required.");
    _context.Carts.Add(cart);
    await _context.SaveChangesAsync();
    return Ok(new { cartID = cart.CartID });
  }

  // ---------- 2) ดึงหรือสร้างตะกร้าของ user แบบ idempotent ----------
  // ตัวนี้คือ endpoint ที่ฝั่ง Angular เรียกใน addToCart()
  [AllowAnonymous]
  [HttpPost("GetOrCreateCart")]
  public async Task<IActionResult> GetOrCreateCart([FromQuery] int userId)
  {
    if (userId <= 0) return BadRequest("userId is required.");

    var cartId = await _context.Carts
      .Where(c => c.UserID == userId)
      .Select(c => c.CartID)
      .FirstOrDefaultAsync();

    if (cartId == 0)
    {
      var cart = new Cart { UserID = userId, CartItems = new List<CartItem>() };
      _context.Carts.Add(cart);
      await _context.SaveChangesAsync();
      cartId = cart.CartID;
    }

    return Ok(new { cartID = cartId });
  }

  // ---------- 3) เพิ่มสินค้าเข้าตะกร้า (upsert: ถ้ามีอยู่แล้วให้ +quantity) ----------
  [AllowAnonymous]
  [HttpPost("AddItemToCart")]
  public async Task<IActionResult> AddItemToCart([FromBody] CartItem cartItem)
  {
    if (cartItem == null || cartItem.CartID <= 0 || cartItem.ProductID <= 0 || cartItem.Quantity <= 0)
      return BadRequest("CartID, ProductID and Quantity are required.");

    var cartExists = await _context.Carts.AnyAsync(c => c.CartID == cartItem.CartID);
    if (!cartExists) return NotFound("Cart not found.");

    var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductID == cartItem.ProductID);
    if (product == null) return NotFound("Product not found.");

    // unit price (ถ้าราคา null ให้ 0)
    var unitPrice = product.Price ?? 0m;

    // หา existing row สินค้าตัวเดิมใน cart เดียวกัน
    var existing = await _context.CartItems
      .FirstOrDefaultAsync(x => x.CartID == cartItem.CartID && x.ProductID == cartItem.ProductID);

    if (existing != null)
    {
      existing.Quantity += cartItem.Quantity;
      existing.PriceAmount = unitPrice; // เก็บราคาต่อชิ้น (หรือจะเก็บราคารวมก็เปลี่ยน logic)
      await _context.SaveChangesAsync();
      return Ok(new { cartItemID = existing.CartItemID, quantity = existing.Quantity });
    }

    // ยังไม่มี -> เพิ่มใหม่
    cartItem.PriceAmount = unitPrice; // ราคาต่อชิ้น
    _context.CartItems.Add(cartItem);
    await _context.SaveChangesAsync();
    return Ok(new { cartItemID = cartItem.CartItemID, quantity = cartItem.Quantity });
  }

  // ---------- 4) โหลดรายการสินค้าทั้งหมดในตะกร้า ----------
  [AllowAnonymous]
  [HttpGet("Items")]
  public async Task<IActionResult> GetItems([FromQuery] int cartId)
  {
    if (cartId <= 0) return BadRequest("cartId is required.");

    var items = await (from ci in _context.CartItems
                       join p in _context.Products on ci.ProductID equals p.ProductID
                       where ci.CartID == cartId
                       select new
                       {
                         cartItemID = ci.CartItemID,
                         cartID = ci.CartID,
                         productID = ci.ProductID,
                         product_Name = p.Product_Name,
                         price_amount = ci.PriceAmount,     
                         quantity = ci.Quantity,
                         image_Url1 = p.Image_Url1
                       }).ToListAsync();

    return Ok(items);
  }

  // ---------- 5) ปรับจำนวน ----------
  [AllowAnonymous]
  [HttpPut("UpdateItemQuantity")]
  public async Task<IActionResult> UpdateItemQuantity([FromBody] CartItem dto)
  {
    if (dto == null || dto.CartItemID <= 0 || dto.Quantity <= 0)
      return BadRequest("CartItemID and Quantity are required.");

    var item = await _context.CartItems.FirstOrDefaultAsync(x => x.CartItemID == dto.CartItemID);
    if (item == null) return NotFound();

    item.Quantity = dto.Quantity;

    // ถ้าอยากคำนวณราคาต่อชิ้นใหม่จาก Product ทุกครั้ง:
    var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductID == item.ProductID);
    item.PriceAmount = product?.Price ?? item.PriceAmount;

    await _context.SaveChangesAsync();
    return Ok(new { cartItemID = item.CartItemID, quantity = item.Quantity });
  }

  // ---------- 6) ลบรายการ ----------
  [AllowAnonymous]
  [HttpDelete("RemoveItem/{cartItemId:int}")]
  public async Task<IActionResult> RemoveItem(int cartItemId)
  {
    var item = await _context.CartItems.FindAsync(cartItemId);
    if (item == null) return NotFound();
    _context.CartItems.Remove(item);
    await _context.SaveChangesAsync();
    return Ok();
  }

  // ---------- 7) เคลียร์ทั้งตะกร้า ----------
  [AllowAnonymous]
  [HttpDelete("Clear")]
  public async Task<IActionResult> Clear([FromQuery] int cartId)
  {
    var items = await _context.CartItems.Where(x => x.CartID == cartId).ToListAsync();
    if (items.Count == 0) return Ok(); // ไม่มีของก็ถือว่าเคลียร์แล้ว

    _context.CartItems.RemoveRange(items);
    await _context.SaveChangesAsync();
    return Ok();
  }
}
