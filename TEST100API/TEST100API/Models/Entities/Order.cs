namespace TEST100API.Models.Entities
{
  public class Order
  {
    public int OrderID { get; set; }
    public int CartID { get; set; }
    public Cart? Cart { get; set; }
    public ShippingInfo? ShippingInfo { get; set; }
    public Payment? Payment { get; set; }
    public string? Status { get; set; }
    public DateTime Order_date { get; set; }
    public decimal TotalAmount { get; set; }
  }
}
