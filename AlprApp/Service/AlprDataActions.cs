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
    public class AlprData
    {
        public string image { get; set; }
    }

    public class AlprDataActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: AlprData */>
    {
    }
}