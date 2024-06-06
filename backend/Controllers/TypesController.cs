using Microsoft.AspNetCore.Mvc;
using backend.Repositories;
using backend.Helpers;

namespace backend.Controllers
{
    [Route("api/types")]
    [ApiController]
    public class TypesController : ControllerBase
    {
        private readonly ITypeRepository _typeRepository;
        private readonly ResponseHelper _responseHelper;

        public TypesController(ITypeRepository typeRepository, ResponseHelper responseHelper)
        {
            _typeRepository = typeRepository;
            _responseHelper = responseHelper;
        }

        // GET: api/types
        [HttpGet]
        public async Task<IActionResult> GetTypes()
        {
            try
            {
                var types = await _typeRepository.GetAllTypes();
                return _responseHelper.CreateResponse("Types retrieved successfully", types, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // GET: api/types/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetType(int id)
        {
            try
            {
                var type = await _typeRepository.GetTypeById(id);
                if (type == null)
                {
                    return _responseHelper.CreateResponse("Type not found", null, "fail");
                }
                return _responseHelper.CreateResponse("Type retrieved successfully", type, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }
    }
}
