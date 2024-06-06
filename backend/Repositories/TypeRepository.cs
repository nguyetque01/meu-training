using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Repositories
{
    public interface ITypeRepository
    {
        Task<IEnumerable<Models.Type>> GetAllTypes();
        Task<Models.Type> GetTypeById(int id);
    }

    public class TypeRepository : ITypeRepository
    {
        private readonly MeuTrainingContext _context;

        public TypeRepository(MeuTrainingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Models.Type>> GetAllTypes()
        {
            return await _context.Types.ToListAsync();
        }

        public async Task<Models.Type> GetTypeById(int id)
        {
            var type = await _context.Types.FindAsync(id);

            if (type == null)
            {
                throw new InvalidOperationException("Type not found");
            }
            return type;
        }
    }
}
