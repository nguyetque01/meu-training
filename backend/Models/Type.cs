﻿using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Type
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
