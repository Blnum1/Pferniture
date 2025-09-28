namespace TEST100API.Models.Entities
{
  public class Product
  {
    public int ProductID { get; set; }
    public string? Product_Name { get; set; }
    public string? Size { get; set; }
    public string? Color { get; set; }  
    public string? PDescription1 { get; set; }
    public string? PDescription2 { get; set; }
    public string? PDescription3 { get; set; }
    public decimal? Price { get; set; }
    public decimal? Price_Discount { get; set; }
    public int? CategoryID { get; set; }
    public Category? Category { get; set; }
    public string? Image_Url1 { get; set; }
    public string? Image_Url2 { get; set; }
    public string? Image_Url3 { get; set; }
    public DateTime Create_At { get; set; }
    public string? Is_Active { get; set; }
    public int? Stock { get; set; }
    public ICollection<CartItem>? CartItems { get; set; }
    public ICollection<OrderItem>? OrderItems { get; set; }


  }
}
