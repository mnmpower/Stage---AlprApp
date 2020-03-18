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

    public class PlateObject
    {
        public string plate { get; set; }
        public float confidence { get; set; }
        public int matches_template { get; set; }

    }


    public class PlateObjectActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: plateObject */>
    {
    }
}