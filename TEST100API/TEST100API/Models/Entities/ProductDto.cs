namespace TEST100API.Models.Entities
{
  public class ProductDto
  {
      public int ProductID { get; set; }
      public string Product_Name { get; set; }
      public string? Size { get; set; }
      public string? Color { get; set; }
      public string? PDescription1 { get; set; }
      public decimal Price { get; set; }
      public decimal Price_Discount { get; set; }
      public int CategoryID { get; set; }
      public string Category_Name { get; set; }
      public string Image_Url1 { get; set; }
      public string Is_Active { get; set; }
      public int? Stock { get; set; }
  }
}
