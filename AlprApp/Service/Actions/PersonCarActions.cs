using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class PersonCar
    {
        [Key]
        public int PersonCarID { get; set; }
        public int PersonID { get; set; }
        public int CarID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("PersonID")]
        public virtual Person Person { get; set; }

        [ForeignKey("CarID")]
        public virtual Car Car { get; set; }


        public class PersonCarActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, PersonCar>
        {

        }
    }
}