using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;

[Route("api/[controller]")]
[ApiController]
public class ShippingInfoController : ControllerBase
{
  private readonly AppDbContext _context;
  public ShippingInfoController(AppDbContext context) { _context = context; }

  // GET: api/shippinginfo/user/5
  [HttpGet("GetUserShippings/{userId:int}")]
  public async Task<IActionResult> GetByUser(int userId)
  {
    var existsUser = await _context.Users.AnyAsync(u => u.UserID == userId);
    if (!existsUser) return NotFound("User not found.");

    var list = await _context.ShippingInfos
        .Where(s => s.UserID == userId)
        .OrderByDescending(s => s.ShippingInfoID)
        .ToListAsync();

    return Ok(list);
  }

  // GET: api/shippinginfo/123?userId=5

  [HttpGet("GetShipping/{id:int}")]
  public async Task<IActionResult> GetOne(int id, [FromQuery] int userId)
  {
    var s = await _context.ShippingInfos.FirstOrDefaultAsync(x => x.ShippingInfoID == id);
    if (s == null) return NotFound("ShippingInfo not found.");
    if (s.UserID != userId) return Forbid(); 

    return Ok(s);
  }

  // POST: api/shippinginfo
  [HttpPost("CreateShipping")]
  public async Task<IActionResult> Create([FromBody] ShippingInfoCreateDto dto)
  {
    if (dto == null) return BadRequest("Body is required.");
    if (dto.UserID <= 0) return BadRequest("UserID is required.");
    if (string.IsNullOrWhiteSpace(dto.Address))
      return BadRequest("Address is required.");

    var existsUser = await _context.Users.AnyAsync(u => u.UserID == dto.UserID);
    if (!existsUser) return NotFound("User not found.");

    var entity = new ShippingInfo
    {
      UserID = dto.UserID,
      Address = dto.Address.Trim(),
      City = dto.City,
      Region = dto.Region,
      Country = dto.Country,
      Postal_Code = dto.Postal_Code,
      Shipping_Method = dto.Shipping_Method,
      Shipping_Phone = dto.Shipping_Phone
    };

    _context.ShippingInfos.Add(entity);
    await _context.SaveChangesAsync();

    // คืน 201 + location header ไปที่ GetOne (แนบ userId เพื่อผ่าน owner check)
    return CreatedAtAction(nameof(GetOne), new { id = entity.ShippingInfoID, userId = entity.UserID }, entity);
  }

  // PUT: api/shippinginfo/123?userId=5
  [HttpPut("UpdateShipping/{id:int}")]
  public async Task<IActionResult> Update(int id, [FromQuery] int userId, [FromBody] ShippingInfoUpdateDto dto)
  {
    if (dto == null) return BadRequest("Body is required.");

    var s = await _context.ShippingInfos.FirstOrDefaultAsync(x => x.ShippingInfoID == id);
    if (s == null) return NotFound("ShippingInfo not found.");
    if (s.UserID != userId) return Forbid(); 

    if (!string.IsNullOrWhiteSpace(dto.Address)) s.Address = dto.Address.Trim();
    if (dto.City != null) s.City = dto.City;
    if (dto.Region != null) s.Region = dto.Region;
    if (dto.Country != null) s.Country = dto.Country;
    if (dto.Postal_Code.HasValue) s.Postal_Code = dto.Postal_Code;
    if (dto.Shipping_Method != null) s.Shipping_Method = dto.Shipping_Method;
    if (dto.Shipping_Phone != null) s.Shipping_Phone = dto.Shipping_Phone;

    await _context.SaveChangesAsync();
    return Ok(s);
  }

  // DELETE: api/shippinginfo/123?userId=5
  [HttpDelete("DeleteShipping/{id:int}")]
  public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
  {
    var s = await _context.ShippingInfos.FirstOrDefaultAsync(x => x.ShippingInfoID == id);
    if (s == null) return NotFound("ShippingInfo not found.");
    if (s.UserID != userId) return Forbid(); 

    var inUse = await _context.Orders.AnyAsync(o => o.ShippingInfoID == id);
    if (inUse) return BadRequest("This address is used by an order and cannot be deleted.");

    _context.ShippingInfos.Remove(s);
    await _context.SaveChangesAsync();
    return NoContent();
  }
}
