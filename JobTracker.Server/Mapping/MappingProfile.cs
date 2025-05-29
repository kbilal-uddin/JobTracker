using AutoMapper;
using JobTracker.Server.Models.Database;
using JobTracker.Server.Models.External;

namespace JobTracker.Server.Mapping
{

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Define your object mappings here
            CreateMap<JobApplication, JobApplicationResponse>();
            CreateMap<JobApplicationModel, JobApplication>();

        }
    }
}
