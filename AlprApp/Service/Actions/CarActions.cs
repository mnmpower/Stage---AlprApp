using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class Car
    {
        [Key]
        public int CarID { get; set; }
        public int CompanyID { get; set; }
        public string LicensePlate { get; set; }

        [ForeignKey("CompanyID")]
        public virtual Company Company { get; set; }

       
        public class CarActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, Car>
        {

        }
    }
}