using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScoreTracker.Api.Data; // Reuse the DbContext from the Api project
using ScoreTracker.Api.Models.Entities; // Reuse the User entity
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// === 1. CONFIGURE SERVICES ===

// --- Database & Identity (needed for user provisioning) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// --- Data Protection (IDENTICAL TO API PROJECT) ---
var dataProtectionBlobUri = new Uri(builder.Configuration.GetValue<string>("AzureDataProtection:BlobStorageUri")
    ?? throw new InvalidOperationException("AzureDataProtection:BlobStorageUri not configured."));

builder.Services.AddDataProtection()
    .PersistKeysToAzureBlobStorage(dataProtectionBlobUri)
    .SetApplicationName("ScoreTrackerShared"); // MUST be the same as the Api project

// --- Distributed Session Cache using Azure Redis (IDENTICAL TO API PROJECT) ---
var redisConnectionString = builder.Configuration.GetConnectionString("Redis")
    ?? throw new InvalidOperationException("Connection string 'Redis' not found.");
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "ScoreTracker_";
});

// --- Session Configuration (IDENTICAL TO API PROJECT) ---
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.Name = ".ScoreTracker.Session";
    // options.Cookie.Domain = ".yourdomain.com"; // UNCOMMENT AND SET IN PRODUCTION
});

// --- SSO Authentication Handlers ---
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies()
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
        // This event is triggered after a successful Google login.
        options.Events.OnCreatingTicket = HandleExternalLogin; 
    })
    .AddSaml2(options =>
    {
        options.SPOptions.EntityId = "https://app.yourdomain.com/Saml2";
        options.IdentityProviders.Add(
            new Sustainsys.Saml2.IdentityProvider(
                builder.Configuration["Authentication:Saml2:EntityId"],
                entityId: builder.Configuration["Authentication:Saml2:MetadataAddress"])
            {
                LoadMetadata = true
            });
        // This event is triggered after a successful SAML login.
        options.Events.OnTicketReceived = context => HandleExternalLogin(context.Principal!);
    });

builder.Services.AddControllers();

// === 2. CONFIGURE HTTP REQUEST PIPELINE (MIDDLEWARE) ===

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serve static files like CSS, JS from wwwroot (where Angular builds to)
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllers(); // Maps the AuthController for initiating SSO
app.MapFallbackToFile("index.html"); // For SPA routing: forwards all other requests to Angular

app.Run();

// --- Helper Method for User Provisioning ---
async Task HandleExternalLogin(ClaimsPrincipal principal)
{
    var email = principal.FindFirstValue(ClaimTypes.Email);
    if (string.IsNullOrEmpty(email)) return;

    // We need to resolve services manually within this event handler
    using var scope = app.Services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    var user = await userManager.FindByEmailAsync(email);
    // If user doesn't exist, create them
    if (user == null)
    {
        var fullName = principal.FindFirstValue(ClaimTypes.Name) ?? principal.FindFirstValue("name") ?? "New User";
        user = new ApplicationUser { UserName = email, Email = email, FullName = fullName };
        var result = await userManager.CreateAsync(user);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "User");
        }
    }
}
async Task HandleExternalLogin(OAuthCreatingTicketContext context) => await HandleExternalLogin(context.Principal!);
