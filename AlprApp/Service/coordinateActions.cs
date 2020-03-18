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

    public class Coordinate
    {
        public float x { get; set; }
        public float y { get; set; }
        
    }

    public class CoordinateActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: coordinate */>
    {
    }
}