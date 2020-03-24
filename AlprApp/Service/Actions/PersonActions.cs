using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AlprApp.Service.Actions
{
    public class Person
    {
        [Key]
        public int PersonID { get; set; }
        public string FristName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        
        public virtual ICollection<PersonCar> PersonCar { get; set; }

        public class PersonActions : PersistentObjectActionsReference<AlprAppEntityModelContainer, Person>
        {

        }
    }
}