using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class Message
    {
        [Key]
        public int MessageID { get; set; }
        public int PersonCarID { get; set; }
        public int? PremadeMessageID { get; set; }
        public string Text { get; set; }

        [ForeignKey("PersonCarID")]
        public virtual PersonCar PersonCar { get; set; }

        [ForeignKey("PremadeMessageID")]
        public virtual PremadeMessage PremadeMessage { get; set; }


        public class MessageActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, Message>
        {

        }
    }
}