using JobTracker.Server.Data;
using JobTracker.Server.Handlers;
using JobTracker.Server.Interfaces;
using JobTracker.Server.Mapping;
using JobTracker.Server.Processors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddScoped<IJobApplicationHandler, JobApplicationHandler>();
builder.Services.AddScoped<IJobApplicationProcessor, JobApplicationProcessor>();
builder.Services.AddAutoMapper(typeof(MappingProfile)); // Or typeof(Program)


builder.Services.AddCors(options =>
{
    options.AddPolicy("Policy",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"D:\Personal\JobTrackerApplicationFiles"),
    RequestPath = "/files"
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Policy");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
