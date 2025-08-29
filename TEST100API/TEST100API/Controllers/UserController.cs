using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEST100API.Data;
using TEST100API.Models;
using TEST100API.Models.Entities;

namespace TEST100API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [EnableCors("AllowOrigin")]
  public class UserController : ControllerBase
  {
    private readonly IConfiguration _config;
    public readonly UserDbContext _context;
    public UserController(IConfiguration config, UserDbContext context)
    {
      _config = config;
      _context = context;
    }

    [AllowAnonymous]
    [HttpPost("CreateUser")]
    public IActionResult Create(User user)
    {
      if(_context.Users.Where(u => u.Email == user.Email).FirstOrDefault() != null)
      { return Ok("Already Exist");
      }
      user.Role = "user";
      user.MemberSince = DateTime.Now;
      _context.Users.Add(user);
      _context.SaveChanges();
      return Ok("Success");
    }

    [AllowAnonymous]
    [HttpPost("LoginUser")]
    public IActionResult Login(Login user)
    {
      var userAvalible = _context.Users.Where(u => u.Email == user.Email && u.Pwd == user.Pwd).FirstOrDefault();
      if (userAvalible != null)
      {
        return Ok(new JwtService(_config).GenerateToken(
          userAvalible.UserID.ToString(),
          userAvalible.FirstName,
          userAvalible.LastName,
          userAvalible.Email,
          userAvalible.Phone,
          userAvalible.Role
          ));
      }
      return Ok("Failure");
    }
  }
}
