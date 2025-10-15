using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using TEST100API.Data;
using TEST100API.Models.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ShowOrderController : ControllerBase
  {
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public ShowOrderController(IConfiguration config, AppDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpGet("GetShowOrder")]
    public async Task<IActionResult> GetShowOrder([FromQuery] string status, [FromQuery] int userid) 
    {
      var rows = await _context.Set<ShowOrderDto>()
          .FromSqlRaw(@"
                    SELECT 
                        u.UserID, 
                        u.FirstName AS UserFirstName,  
                        u.LastName AS UserLastName,   
                        o.OrderID, 
                        o.ShippingInfoID, 
                        o.CartID, 
                        o.Status, 
                        o.Order_date, 
                        oi.OrderItemID, 
                        oi.ProductID,
                        oi.Quantity,
                        oi.PriceAmount,
                        p.Product_Name, 
                        p.Color, 
                        p.Size,
                        p.Image_Url1,
                        si.Shipping_Phone,
                        si.firstname AS ShippingFirstName, 
                        si.LastName AS ShippingLastName,
                        si.Address,
                        si.City,
                        si.Region,
                        si.Country,
                        si.Postal_Code,
                        pm.PaymentID,
                        pm.Payment_Method,
                        pm.Payment_Status,
                        pm.Payment_Amount,
                        pm.Payment_date
                    FROM Orders o
                    JOIN OrderItems oi ON oi.OrderID = o.OrderID
                    JOIN Products p ON p.ProductID = oi.ProductID
                    JOIN Carts c ON c.CartID = o.CartID
                    JOIN Users u ON u.UserID = c.UserID
                    JOIN ShippingInfos si ON si.ShippingInfoID = o.ShippingInfoID
                    JOIN Payments pm ON pm.OrderID = o.OrderID
                   WHERE 
                    (
                        @status = 'All' AND o.Status IN ('waitpay', 'musttranfer', 'mustrecieve', 'finish') 
                        OR o.Status = @status
                    )
                    AND u.UserID = @userid
                    ORDER BY 
                        o.OrderID DESC",
              new SqlParameter("@status", status),
               new SqlParameter("@userid", userid))
          .AsNoTracking()
          .ToListAsync();

      return Ok(rows);
    }


    [AllowAnonymous]
    [HttpGet("GetShowAllOrder")]
    public async Task<IActionResult> GetShowOrder([FromQuery] string status)
    {
      var rows = await _context.Set<ShowOrderDto>()
          .FromSqlRaw(@"
            SELECT 
                u.UserID, 
                u.FirstName AS UserFirstName,  
                u.LastName AS UserLastName,    
                o.OrderID, 
                o.ShippingInfoID, 
                o.CartID, 
                o.Status, 
                o.Order_date, 
                oi.OrderItemID, 
                oi.ProductID,
                oi.Quantity,
                oi.PriceAmount,
                p.Product_Name, 
                p.Color, 
                p.Size,
                p.Image_Url1,
                si.Shipping_Phone,
                si.firstname AS ShippingFirstName, 
                si.LastName AS ShippingLastName,
                si.Address,
                si.City,
                si.Region,
                si.Country,
                si.Postal_Code,
                pm.PaymentID,
                pm.Payment_Method,
                pm.Payment_Status,
                pm.Payment_Amount,
                pm.Payment_date
            FROM Orders o
            JOIN OrderItems oi ON oi.OrderID = o.OrderID
            JOIN Products p ON p.ProductID = oi.ProductID
            JOIN Carts c ON c.CartID = o.CartID
            JOIN Users u ON u.UserID = c.UserID
            JOIN ShippingInfos si ON si.ShippingInfoID = o.ShippingInfoID
            JOIN Payments pm ON pm.OrderID = o.OrderID
            WHERE 
              (
                  @status = 'All' AND o.Status IN ('waitpay', 'musttranfer', 'mustrecieve', 'finish') 
                  OR o.Status = @status
              )
            ORDER BY 
                o.OrderID DESC",
              new SqlParameter("@status", status))
          .AsNoTracking()
          .ToListAsync();

      return Ok(rows);
    }

    [AllowAnonymous]
    [HttpGet("GetShowOrderByID")]
    public async Task<IActionResult> GetShowOrderbyID([FromQuery] int orderID)
    {
      var rows = await _context.Set<ShowOrderDto>()
          .FromSqlRaw(@"
            SELECT 
                u.UserID, 
                u.FirstName AS UserFirstName,  
                u.LastName AS UserLastName,    
                o.OrderID, 
                o.ShippingInfoID, 
                o.CartID, 
                o.Status, 
                o.Order_date, 
                oi.OrderItemID, 
                oi.ProductID,
                oi.Quantity,
                oi.PriceAmount,
                p.Product_Name, 
                p.Color, 
                p.Size,
                p.Image_Url1,
                si.Shipping_Phone,
                si.firstname AS ShippingFirstName, 
                si.LastName AS ShippingLastName,
                si.Address,
                si.City,
                si.Region,
                si.Country,
                si.Postal_Code,
                pm.PaymentID,
                pm.Payment_Method,
                pm.Payment_Status,
                pm.Payment_Amount,
                pm.Payment_date
            FROM Orders o
            JOIN OrderItems oi ON oi.OrderID = o.OrderID
            JOIN Products p ON p.ProductID = oi.ProductID
            JOIN Carts c ON c.CartID = o.CartID
            JOIN Users u ON u.UserID = c.UserID
            JOIN ShippingInfos si ON si.ShippingInfoID = o.ShippingInfoID
            JOIN Payments pm ON pm.OrderID = o.OrderID
            WHERE o.OrderID = @orderID 
            ORDER BY 
                o.OrderID DESC", 
              new SqlParameter("@orderID", orderID)  
          )
          .AsNoTracking()
          .ToListAsync();

      return Ok(rows);
    }




  }
}


