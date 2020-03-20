using AlprApp.Service.Actions;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using Vidyano.Core.Extensions;
using Vidyano.Service;
using Vidyano.Service.Repository;

namespace AlprApp.Service
{
    public partial class AlprAppEntityModelContainer : TargetDbContext
    {
        //ENTITYES MAPPEN MET DB (OPDRACHTOCNTEXT)
        public DbSet<Person> Persons { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<PremadeMessage> PremadeMessages { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<PersonCar> PersonCars { get; set; }
        public DbSet<Message> Messages { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            modelBuilder.Entity<Person>().ToTable("Person");
            modelBuilder.Entity<Company>().ToTable("Company");
            modelBuilder.Entity<PremadeMessage>().ToTable("PremadeMessage");
            modelBuilder.Entity<Car>().ToTable("Car");
            modelBuilder.Entity<PersonCar>().ToTable("ComPersonCarpany");
            modelBuilder.Entity<Message>().ToTable("Message");
        }
    }
}