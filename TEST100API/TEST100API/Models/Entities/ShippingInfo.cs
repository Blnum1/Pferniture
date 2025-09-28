namespace TEST100API.Models.Entities
{
  public class ShippingInfo
  {
    public int ShippingInfoID { get; set; }
    public int UserID { get; set; }
    public User? User { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public int? Postal_Code { get; set; }
    public string? Shipping_Method { get; set; }
    public string? Shipping_Phone { get; set; }
  }

  public class ShippingInfoCreateDto
  {
    public int UserID { get; set; }
    public string Address { get; set; } = "";
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public int? Postal_Code { get; set; }
    public string? Shipping_Method { get; set; }
    public string? Shipping_Phone { get; set; }
  }

  public class ShippingInfoUpdateDto
  {
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public int? Postal_Code { get; set; }
    public string? Shipping_Method { get; set; }
    public string? Shipping_Phone { get; set; }
  }


}
