namespace TEST100API.Models.Entities
{
  public class Order
  {
    public int OrderID { get; set; }
    public int? UserID { get; set; }
    public User? User { get; set; }
    public ShippingInfo? ShippingInfo { get; set; }
    public Payment? Payment { get; set; }
    public int? ProductID { get; set; }
    public Product? Product { get; set; }
    public decimal? Total_amount { get; set; }
    public string? Status { get; set; }
    public DateTime Order_date { get; set; }
    public decimal? Price_amount { get; set; }
  }
}
