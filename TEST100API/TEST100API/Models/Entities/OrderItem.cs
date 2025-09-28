namespace TEST100API.Models.Entities
{
  public class OrderItem
  {
    public int OrderItemID { get; set; }
    public int OrderID { get; set; }
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAmount { get; set; }
    public Order Order { get; set; }
    public Product Product { get; set; }
  }
}
