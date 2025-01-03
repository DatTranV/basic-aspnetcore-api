
using AuthAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Services from Identity Core
            builder.Services.AddIdentityApiEndpoints<AppUser>()
                 .AddEntityFrameworkStores<AppDbContext>();

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.User.RequireUniqueEmail = true;
            });
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DevDB")));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            #region Config. CORS
            app.UseCors(options =>

                options.WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader()
            );
            #endregion
            app.UseAuthorization();

            app.MapControllers();

            app
                .MapGroup("/api")
                .MapIdentityApi<AppUser>();

            app.MapPost("api/signup", async (UserManager<AppUser> userManager,
                [FromBody] UserRegistrationModel UserRegistrationModel
                ) =>
            {
                AppUser user = new()
                {
                    UserName = UserRegistrationModel.Email,
                    Email = UserRegistrationModel.Email,
                    FullName = UserRegistrationModel.FullName,
                };

                var result = await userManager.CreateAsync(user, UserRegistrationModel.Password);

                if (result.
                Succeeded)
                    return Results.Ok(result);
                else
                    return Results.BadRequest(result);
            });


            app.Run();
        }

        public class UserRegistrationModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string FullName { get; set; }
        }
    }

}
