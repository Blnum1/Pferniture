using System.ComponentModel.DataAnnotations.Schema;

namespace TEST100API.Models.Entities
{
  public class ShowOrderDto
  {
    public int? CartID { get; set; }
    public int? UserID { get; set; }
    public string? UserFirstName { get; set; }  // ใช้ UserFirstName แทน FirstName
    public string? UserLastName { get; set; }   // ใช้ UserLastName แทน LastName

    public int? ShippingInfoID { get; set; }
    public string? Status { get; set; }
    public DateTime? Order_date { get; set; }

    public int? OrderID { get; set; }
    public int? OrderItemID { get; set; }
    public int? Quantity { get; set; }
    public decimal? PriceAmount { get; set; }
    public int? ProductID { get; set; }
    public string? Product_Name { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public string? Image_Url1 { get; set; }

    public string? Shipping_Phone { get; set; }
    public string? ShippingFirstName { get; set; }  // ใช้ ShippingFirstName แทน firstname
    public string? ShippingLastName { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public int? Postal_Code { get; set; }// ใช้ ShippingLastName แทน LastName
    public int? PaymentID { get; set; }
    public string? Payment_Method { get; set; }
    public string? Payment_Status { get; set; }
    public decimal? Payment_Amount { get; set; }
    public DateTime? Payment_Date { get; set; }
  }


}
