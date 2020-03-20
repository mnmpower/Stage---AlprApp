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
    public class AlprDataActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, object /* replace with .NET class if needed: AlprData */>
    {
        public override void OnNew(PersistentObject obj, PersistentObject parent, Query query, Dictionary<string, string> parameters)
        {
            base.OnNew(obj, parent, query, parameters);
            Context.Database.ExecuteSqlCommand("Select * from dbo.Wagen");
        }
    }
}