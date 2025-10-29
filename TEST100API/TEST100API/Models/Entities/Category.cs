namespace TEST100API.Models.Entities
{
  public class Category
  {
    public int CategoryID { get; set; }   
    public string Category_Name { get; set; }

    public ICollection<Product>? Products { get; set; } = new List<Product>();
  }
}
