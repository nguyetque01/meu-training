using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string? Brand { get; set; }

    public string? Type { get; set; }

    public string? Description { get; set; }

    [NotMapped]
    public Dictionary<string, List<int>> SearchMatches { get; set; } = new Dictionary<string, List<int>>();
}