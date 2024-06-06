using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Code{ get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string? Brand { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public Dictionary<string, List<int>> SearchMatches { get; set; } = new Dictionary<string, List<int>>();
    }
}
