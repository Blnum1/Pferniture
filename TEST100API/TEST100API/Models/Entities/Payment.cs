namespace TEST100API.Models.Entities
{
  public class Payment
  {
    public int PaymentID { get; set; }
    public int? OrderID { get; set; }
    public Order? Order { get; set; }
    public decimal? Payment_Amount { get; set; }
    public DateTime Payment_date { get; set; }
    public string? Payment_Method { get; set; }
    public string? Payment_Status { get; set; }
  }
}
