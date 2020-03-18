using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Vidyano.Core.Extensions;
using Vidyano.Service;
using Vidyano.Service.Charts;
using Vidyano.Service.Repository;

namespace AlprApp.Service
{

    public class AlprReturn
    {
        public string plate { get; set; }
        public float confidence { get; set; }
        public int matches_template { get; set; }
        public int plate_index { get; set; }
        public string region { get; set; }
        public int region_confidence { get; set; }
        public float processing_time_ms { get; set; }
        public int requested_topn { get; set; }
        public Coordinate[] coordinates { get; set; }
        public PlateObject[] candidates { get; set; } 
    }


    public class AlprReturnActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: AlprReturn */>
    {
    }
}