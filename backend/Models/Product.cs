using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public int? BrandId { get; set; }

    public int? TypeId { get; set; }

    public string? Description { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual Type? Type { get; set; }
}