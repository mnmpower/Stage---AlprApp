using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Vidyano.Core.Extensions;
using Vidyano.Service;
using Vidyano.Service.Charts;
using Vidyano.Service.Repository;

namespace AlprApp.Service
{

    public class AlprWithHeader
    {
        public string version { get; set; }
        public string data_type { get; set; }
        public long epoch_time { get; set; }
        public int img_width { get; set; }
        public int img_height { get; set; }
        public float processing_time_ms { get; set; }
        public string[] regions_of_interest { get; set; }
        public AlprReturn[] results { get; set; }

    }
    public class AlprWithHeaderActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: AlprWithHeader */>
    {
    }
}