using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class Company
    {
        [Key]
        public int CompanyID { get; set; }
        public string Name { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string PostalCode { get; set; }
        
        public ICollection<Car> Cars { get; set; }

        public class CompanyActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, Company>
        {

        }
    }
}