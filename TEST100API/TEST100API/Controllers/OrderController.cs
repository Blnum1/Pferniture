using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;
using Microsoft.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
  private readonly AppDbContext _context;

  public OrderController(AppDbContext context)
  {
    _context = context;
  }

  [HttpPost("CreateOrderFromCart")]
  public IActionResult CreateOrderFromCart([FromBody] Order order)
  {
    // Step 1: ตรวจสอบว่า CartID มีอยู่ในระบบ
    var cart = _context.Carts.Include(c => c.CartItems)  // ใช้ Include เพื่อนำ CartItems มาด้วย
        .FirstOrDefault(c => c.CartID == order.CartID);

    if (cart == null)
    {
      return NotFound("Cart not found.");
    }

    // Step 2: คำนวณ TotalAmount จาก CartItems
    decimal totalAmount = 0;

    var cartItems = _context.CartItems
        .FromSqlRaw("SELECT * FROM CartItems WHERE CartID = {0}", order.CartID)
        .ToList();

    if (cartItems.Count == 0)
    {
      return BadRequest("Cart is empty.");
    }

    foreach (var cartItem in cartItems)
    {
      var product = _context.Products
          .FromSqlRaw("SELECT * FROM Products WHERE ProductID = {0}", cartItem.ProductID)
          .FirstOrDefault();

      if (product == null)
      {
        return BadRequest("Product not found in CartItem.");
      }

      totalAmount += cartItem.PriceAmount * cartItem.Quantity; // คำนวณยอดรวม
    }

    order.TotalAmount = totalAmount;

    // Step 3: สร้าง Order จาก Cart โดยใช้ SCOPE_IDENTITY() เพื่อดึง OrderID ที่สร้างใหม่
    var orderIdQuery = "INSERT INTO Orders (CartID, Status, Order_date, TotalAmount) " +
                       "VALUES ({0}, {1}, {2}, {3}); SELECT CAST(SCOPE_IDENTITY() AS INT);";
    var orderId = _context.Database.ExecuteSqlRaw(orderIdQuery, order.CartID, order.Status, order.Order_date, order.TotalAmount);

    if (orderId == 0)
    {
      return BadRequest("Failed to create order.");
    }

    order.OrderID = orderId;

    // Step 4: เพิ่ม ShippingInfo สำหรับ Order
    var shippingInfoSql = "INSERT INTO ShippingInfos (OrderID, Address, Shipping_Method) " +
                          "VALUES ({0}, {1}, {2})";
    _context.Database.ExecuteSqlRaw(shippingInfoSql, order.OrderID, order.ShippingInfo.Address, order.ShippingInfo.Shipping_Method);

    // Step 5: เพิ่ม Payment สำหรับ Order
    var paymentSql = "INSERT INTO Payments (OrderID, Payment_Amount, Payment_Method, Payment_Status, Payment_date) " +
                     "VALUES ({0}, {1}, {2}, {3}, {4})";
    _context.Database.ExecuteSqlRaw(paymentSql, order.OrderID, order.TotalAmount, order.Payment.Payment_Method, order.Payment.Payment_Status, DateTime.Now);

    return Ok("Order created successfully.");
  }
}






















    //[AllowAnonymous]
    //[HttpPost("CreateOrder")]
    //public IActionResult Create(Order order)
    //{
    //  order.Order_date = DateTime.Now;
    //  _context.Orders.Add(order);
    //  _context.SaveChanges();
    //  return Ok("Success");
    //}



    //[AllowAnonymous]
    //[HttpGet("GetOrderAll")]
    //public async Task<IActionResult> GetOrderAll()
    //{
    //  var rows = await _context.Orders
    //      .FromSqlRaw(@"
    //        select 
    //        o.OrderID ,
    //        o.UserID ,
    //        o.ProductID ,
    //        o.Status ,
    //        o.Price_amount,
    //        o.Order_date,
    //        o.Total_amount 
    //        from Orders o
    //        join Users u on o.UserID = u.UserID 
    //        join Products p on o.ProductID = p.ProductID 
    //        join Payments p2 on o.OrderID = p2.OrderID 
    //        join ShippingInfos si on o.OrderID = si.OrderID ;")
    //      .AsNoTracking()
    //      .ToListAsync();

    //  return Ok(rows);
    //}




















    //[AllowAnonymous]
    //[HttpGet("GetOrderDetail")]
    //public async Task<IActionResult> GetOrderDetail()
    //{
    //  var rows = await _context.OrderDto
    //      .FromSqlRaw(@"
    //        select 
    //        o.OrderID ,
    //        o.UserID ,
    //        u.Email ,
    //        u.FirstName ,
    //        u.LastName ,
    //        o.ProductID ,
    //        p.Product_Name ,
    //        o.Status ,
    //        o.Price_amount,
    //        o.Order_date,
    //        o.Total_amount ,
    //        si.Address ,
    //        si.Shipping_Method ,
    //        p2.Payment_Method ,
    //        p2.Payment_Status ,
    //        p2.Payment_date ,
    //        p2.Payment_Amount 
    //        from Orders o
    //        join Users u on o.UserID = u.UserID 
    //        join Products p on o.ProductID = p.ProductID 
    //        join Payments p2 on o.OrderID = p2.OrderID 
    //        join ShippingInfos si on o.OrderID = si.OrderID ;")
    //      .AsNoTracking()
    //      .ToListAsync();

    //  return Ok(rows);
    //}

    //[AllowAnonymous]
    //[HttpGet("GetOrderCart")]
    //public async Task<IActionResult> GetOrderCart([FromQuery] int userID)
    //{
    //  var rows = await _context.OrderDto
    //      .FromSqlRaw(@"
    //        select 
    //        o.OrderID ,
    //        o.UserID ,
    //        u.Email ,
    //        u.FirstName ,
    //        u.LastName ,
    //        o.ProductID ,
    //        p.Product_Name ,
    //        o.Status ,
    //        o.Price_amount,
    //        o.Order_date,
    //        o.Total_amount ,
    //        si.Address ,
    //        si.Shipping_Method ,
    //        p2.Payment_Method ,
    //        p2.Payment_Status ,
    //        p2.Payment_date ,
    //        p2.Payment_Amount 
    //        from Orders o
    //        join Users u on o.UserID = u.UserID 
    //        join Products p on o.ProductID = p.ProductID 
    //        join Payments p2 on o.OrderID = p2.OrderID 
    //        join ShippingInfos si on o.OrderID = si.OrderID
    //        WHERE o.UserID = @UserID",
    //          new SqlParameter("@UserID", userID)
    //      )
    //      .AsNoTracking()
    //      .ToListAsync();

    //  return Ok(rows);
    //}

    //[HttpPost("AddToCart")]
    //public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
    //{
    //  // ตรวจสอบว่า product มีอยู่จริงหรือไม่
    //  var product = await _context.Products.FindAsync(addToCartDto.ProductID);
    //  if (product == null)
    //  {
    //    return NotFound("Product not found");
    //  }

    //  // สร้าง order ที่มี status เป็น "In-cart"
    //  var order = new Order
    //  {
    //    UserID = addToCartDto.UserID,  // ถ้าเป็น guest ใช้ null
    //    ProductID = addToCartDto.ProductID,
    //    Status = "In-cart",  // ตะกร้าอยู่ในสถานะ In-cart
    //    Price_amount = product.Price,  // ราคาเมื่อเพิ่มลงตะกร้า
    //    Total_amount = product.Price,  // ถ้ามีแค่สินค้าเดียว
    //    Order_date = DateTime.UtcNow,
    //    ShippingInfo = null,  // ยังไม่ระบุที่อยู่
    //    Payment = null  // ยังไม่ชำระเงิน
    //  };

    //  _context.Orders.Add(order);
    //  await _context.SaveChangesAsync();

    //  return Ok(new { message = "Product added to cart successfully", orderId = order.OrderID });
    //}










