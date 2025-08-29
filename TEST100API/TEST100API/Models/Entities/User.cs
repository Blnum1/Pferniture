namespace TEST100API.Models.Entities
{
  public class User
  {
    public int UserID { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Pwd { get; set; }
    public string? Role { get; set; }
    public DateTime MemberSince { get; set; }
  }
}
