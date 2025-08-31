using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductController : ControllerBase
  {
    private readonly IConfiguration _config;
    public readonly ProductDbContext _context;
    public ProductController(IConfiguration config, ProductDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpPost("CreateProduct")]
    public IActionResult Create(Product product)
    {
      product.Create_At = DateTime.Now;
      _context.Products.Add(product);
      _context.SaveChanges();
      return Ok("Success");
    }

    [AllowAnonymous]
    [HttpPost("CreateCategory")]
    public IActionResult CreateCate(Category category)
    {
      _context.Categories.Add(category);
      _context.SaveChanges();
      return Ok("Success");
    }

    [AllowAnonymous]
    [HttpGet("GetByProductID")]
    public async Task<IActionResult> GetByCategorySql([FromQuery] int productID)
    {
      var rows = await _context.Products
          .FromSqlInterpolated($@"SELECT * FROM dbo.Products WHERE ProductID = {productID}")
          .AsNoTracking()
          .ToListAsync();
      return Ok(rows);
    }

    [AllowAnonymous]
    [HttpGet("GetProductAll")]
    public async Task<IActionResult> GetProductAll()
    {
      var rows = await _context.ProductDto
          .FromSqlRaw(@"
            SELECT
              p.ProductID, 
              p.Product_Name, 
              p.Price,
              p.Size,
              p.color
              p.Price_Discount,
              p.PDescription1,
              c.CategoryID ,
              c.Category_Name,
              p.Image_Url, 
              p.Is_Active
            FROM dbo.Products p
            JOIN dbo.Categories c ON p.CategoryID = c.CategoryID
            ORDER BY p.ProductID")
          .AsNoTracking()
          .ToListAsync();
      return Ok(rows);
    }

    [HttpPut("UpdateProduct/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto dto)
    {
      var product = await _context.Products.FindAsync(id);
      if (product == null) return NotFound($"Product {id} not found.");

      if (dto.CategoryID.HasValue)
      {
        var catExists = await _context.Categories.AnyAsync(c => c.CategoryID == dto.CategoryID.Value);
        if (!catExists) return BadRequest($"CategoryID {dto.CategoryID.Value} not found.");
        product.CategoryID = dto.CategoryID;
      }

      if (dto.Product_Name != null) product.Product_Name = dto.Product_Name;
      if (dto.Size != null) product.Size = dto.Size;
      if (dto.Color != null) product.Color = dto.Color;
      if (dto.PDescription1 != null) product.PDescription1 = dto.PDescription1;
      if (dto.PDescription2 != null) product.PDescription2 = dto.PDescription2;
      if (dto.PDescription3 != null) product.PDescription3 = dto.PDescription3;
      if (dto.Price.HasValue) product.Price = dto.Price;
      if (dto.Price_Discount.HasValue) product.Price_Discount = dto.Price_Discount;
      if (dto.Image_Url1 != null) product.Image_Url1 = dto.Image_Url1;
      if (dto.Image_Url2 != null) product.Image_Url2 = dto.Image_Url2;
      if (dto.Image_Url3 != null) product.Image_Url1 = dto.Image_Url3;
      if (dto.Is_Active != null) product.Is_Active = dto.Is_Active;

      await _context.SaveChangesAsync();
      return NoContent();
    }

    [HttpDelete("DeleteProduct/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
      var product = await _context.Products.FindAsync(id);
      if (product == null) return NotFound($"Product {id} not found.");

      _context.Products.Remove(product);
      await _context.SaveChangesAsync();
      return NoContent(); 
    }

    [HttpPut("UpdateCategory/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpdateDto dto)
    {
      var category = await _context.Categories.FindAsync(id);
      if (category == null) return NotFound($"Category {id} not found.");

      if (!string.IsNullOrWhiteSpace(dto.Category_Name))
        category.Category_Name = dto.Category_Name;

      await _context.SaveChangesAsync();
      return NoContent();
    }

    [HttpDelete("DeleteCategory/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
      var category = await _context.Categories
          .Include(c => c.Products) 
          .FirstOrDefaultAsync(c => c.CategoryID == id);

      if (category == null) return NotFound($"Category {id} not found.");

      if (category.Products != null && category.Products.Any())
      {
        return BadRequest("Cannot delete category that still has products. Move or delete products first.");
      }

      _context.Categories.Remove(category);
      await _context.SaveChangesAsync();
      return NoContent();
    }


  }
}
