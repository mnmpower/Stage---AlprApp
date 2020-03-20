using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class PremadeMessage
    {
        [Key]
        public int PremadeMessageID { get; set; }
        public string Text { get; set; }

        public class PremadeMessageActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, PremadeMessage>
        {

        }
    }
}