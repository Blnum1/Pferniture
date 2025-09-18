namespace TEST100API.Models.Entities
{
  public class OrderDetail
  {
    public int OrderDetailID { get; set; }
    public int UserID { get; set; }
    public string UserName { get; set; }
    public int ShippingID { get; set; }
    public int PaymentID { get; set; }
    public int ProductID { get; set; }
    public decimal? Total_amount { get; set; }
    public string? Status { get; set; }
    public DateTime Order_date { get; set; }
    public decimal? Price_amount { get; set; }

  }
}
