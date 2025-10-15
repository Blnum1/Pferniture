// OrderController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
  private readonly AppDbContext _context;
  public OrderController(AppDbContext context) { _context = context; }

  [HttpPost("CreateOrderFromCart")]
  public async Task<IActionResult> CreateOrderFromCart([FromBody] CreateOrderRequest req)
  {
    if (req == null) return BadRequest("Body is required.");
    if (req.CartID <= 0) return BadRequest("CartID is required.");
    if (req.UserID <= 0) return BadRequest("UserID is required.");
    if (req.ShippingInfoID <= 0) return BadRequest("ShippingInfoID is required.");
    if (req.Payment == null) return BadRequest("Payment is required.");

    var cart = await _context.Carts
        .Include(c => c.CartItems)
        .FirstOrDefaultAsync(c => c.CartID == req.CartID);

    if (cart == null) return NotFound("Cart not found.");
    if (cart.UserID != req.UserID) return Forbid();
    if (cart.CartItems == null || cart.CartItems.Count == 0) return BadRequest("Cart is empty.");

    var ship = await _context.ShippingInfos.FirstOrDefaultAsync(s => s.ShippingInfoID == req.ShippingInfoID);
    if (ship == null) return NotFound("ShippingInfo not found.");
    if (ship.UserID != req.UserID) return Forbid();

    var total = 0.0m;
    var orderItems = new List<OrderItem>(); // สร้าง List สำหรับเก็บ OrderItem

    foreach (var cartItem in req.CartItems)
    {
      var item = cart.CartItems.FirstOrDefault(ci => ci.CartItemID == cartItem.CartItemID);
      if (item != null)
      {
        total += item.PriceAmount * cartItem.Quantity;
        item.Quantity -= cartItem.Quantity; 

        var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductID == item.ProductID);
        if (product != null)
        {
          if (product.Stock >= cartItem.Quantity)
          {
            product.Stock -= cartItem.Quantity; 
            _context.Products.Update(product); 
          }
          else
          {
            return BadRequest("Not enough stock for product " + product.Product_Name);
          }
        }

        if (item.Quantity == 0)
        {
          _context.CartItems.Remove(item); 
        }

        // เพิ่ม OrderItem ไปยัง list
        orderItems.Add(new OrderItem
        {
          ProductID = item.ProductID,
          Quantity = cartItem.Quantity,
          PriceAmount = item.PriceAmount
        });
      }
    }

    // เริ่มต้นการทำ Transaction
    await using var tx = await _context.Database.BeginTransactionAsync();
    try
    {
      // สร้าง Order
      var order = new Order
      {
        CartID = req.CartID,
        Status = string.IsNullOrWhiteSpace(req.Status) ? "waitpay" : req.Status,
        Order_date = (req.Order_date == default ? DateTime.Now : req.Order_date),
        TotalAmount = total,
        ShippingInfoID = req.ShippingInfoID
      };

      _context.Orders.Add(order);
      await _context.SaveChangesAsync();

      // เพิ่ม OrderItem
      foreach (var orderItem in orderItems)
      {
        orderItem.OrderID = order.OrderID; // ตั้งค่า OrderID ให้ตรงกัน
        _context.OrderItems.Add(orderItem); // เพิ่ม OrderItem ลงในฐานข้อมูล
      }

      // สร้าง Payment
      var pay = new Payment
      {
        OrderID = order.OrderID,
        Payment_Amount = total,
        Payment_Method = string.IsNullOrWhiteSpace(req.Payment.Payment_Method) ? "QR" : req.Payment.Payment_Method,
        Payment_Status = string.IsNullOrWhiteSpace(req.Payment.Payment_Status) ? "Pending" : req.Payment.Payment_Status,
        Payment_date = (req.Payment.Payment_date == default ? DateTime.Now : req.Payment.Payment_date)
      };
      _context.Payments.Add(pay);

      await _context.SaveChangesAsync();
      await tx.CommitAsync();

      return Ok(new
      {
        message = "Order created successfully",
        orderID = order.OrderID,
        totalAmount = total,
        shippingInfoID = order.ShippingInfoID,
        status = order.Status
      });
    }
    catch (DbUpdateException dbEx)
    {
      await tx.RollbackAsync();
      return StatusCode(500, "Database update failed: " + dbEx.Message);
    }
    catch (Exception ex)
    {
      await tx.RollbackAsync();
      return BadRequest(ex.Message);
    }
  }

  [HttpPost("UpdateOrderStatus")]
  public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateOrderStatusRequest req)
  {
    if (req.OrderID <= 0) return BadRequest("OrderID is required.");
    if (string.IsNullOrEmpty(req.OrderStatus)) return BadRequest("OrderStatus is required.");
    if (string.IsNullOrEmpty(req.PaymentStatus)) return BadRequest("PaymentStatus is required.");

    // ค้นหาคำสั่งซื้อ
    var order = await _context.Orders
        .Include(o => o.Payment) // รวมข้อมูล Payment ที่เกี่ยวข้อง
        .FirstOrDefaultAsync(o => o.OrderID == req.OrderID);

    if (order == null) return NotFound("Order not found.");

    // อัพเดตสถานะของ Order
    order.Status = req.OrderStatus;

    // อัพเดตสถานะของ Payment
    var payment = order.Payment;
    if (payment != null)
    {
      payment.Payment_Status = req.PaymentStatus;
    }

    // บันทึกการเปลี่ยนแปลง
    _context.Orders.Update(order);
    if (payment != null)
    {
      _context.Payments.Update(payment);
    }

    await _context.SaveChangesAsync();

    return Ok(new { message = "Order status and payment status updated successfully." });
  }
}

public class UpdateOrderStatusRequest
{
  public int OrderID { get; set; }
  public string OrderStatus { get; set; }   
  public string PaymentStatus { get; set; } 
}



public class CreateOrderRequest
{
  public int CartID { get; set; }
  public int UserID { get; set; }
  public int ShippingInfoID { get; set; }
  public PaymentDto? Payment { get; set; }
  public string? Status { get; set; }
  public DateTime Order_date { get; set; }

  public List<CartItemDto> CartItems { get; set; }
}

public class CartItemDto
{
  public int CartItemID { get; set; }
  public int ProductID { get; set; }
  public int Quantity { get; set; }
}

public class PaymentDto
{
  public decimal? Payment_Amount { get; set; }
  public DateTime Payment_date { get; set; }
  public string? Payment_Method { get; set; }
  public string? Payment_Status { get; set; }
}
