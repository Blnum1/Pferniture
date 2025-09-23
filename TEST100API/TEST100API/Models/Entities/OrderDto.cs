namespace TEST100API.Models.Entities
{
  public class OrderDto
  {
    public int OrderID { get; set; }
    public int? UserID { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? ProductID { get; set; }
    public string? Product_Name { get; set; } 
    public decimal? Price_amount { get; set; }
    public decimal? Total_amount { get; set; }
    public string? Status { get; set; }
    public DateTime Order_Date { get; set; }
    public string? Address { get; set; } 
    public string? Shipping_Method { get; set; }  
    public string? Payment_Status { get; set; }  
    public string? Payment_Method { get; set; }
    public DateTime Payment_date { get; set; }
    public decimal? Payment_Amount { get; set; } 
  }
}
