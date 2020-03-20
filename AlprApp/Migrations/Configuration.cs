namespace AlprApp.Migrations
{
    using AlprApp.Service.Actions;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<AlprApp.Service.AlprAppEntityModelContainer>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(AlprApp.Service.AlprAppEntityModelContainer context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );

            context.Companies.AddOrUpdate(
                new Company { CompanyID=1, Name="Rhea N.V.", Street="Veldkant", Number="35A", PostalCode="2550" },
                new Company { CompanyID=2, Name="Atlas Copco", Street="Boomsesteenweg", Number="957", PostalCode="2610" }
            );
            context.SaveChanges();

            context.Persons.AddOrUpdate(
                new Person { PersonID=1, FristName="Maarten", LastName="Michiels", Email="r00695495@student.thomasmore.be" },
                new Person { PersonID=2, FristName="Thomas", LastName="Michiels", Email="test@test.be" }
            );
            context.SaveChanges();

            context.PremadeMessages.AddOrUpdate(
                new PremadeMessage {PremadeMessageID=1, Text="De lampen van je wagen branden nog!" },
                new PremadeMessage {PremadeMessageID=2, Text="De radio van je wagen staat now aan!" },
                new PremadeMessage {PremadeMessageID=3, Text="Er staat een raam open van je wagen!" }
            );
            context.SaveChanges();

            context.Cars.AddOrUpdate(
                new Car { CarID=1, CompanyID=1, LicensePlate="1PXL907" },
                new Car { CarID=2, CompanyID=2, LicensePlate="IH786P0J" }
            );
            context.SaveChanges();

            context.PersonCars.AddOrUpdate(
                new PersonCar { PersonCarID=1, PersonID=1, CarID=1, StartDate=new DateTime(2000, 1, 1), EndDate = new DateTime(2020, 1, 1) },
                new PersonCar { PersonCarID=2, PersonID=2, CarID=2, StartDate=new DateTime(2004, 1, 1), EndDate = new DateTime(2024, 1, 1) }
            );
            context.SaveChanges();

            context.Messages.AddOrUpdate(
                new Message { MessageID=1, PersonCarID=1, PremadeMessageID=3 },
                new Message { MessageID=2, PersonCarID=2, Text="Ik ben tegen je wagen gereden. Bel op op 0000/00.00.00"},
                new Message { MessageID=3, PersonCarID=1, Text="misbruik bericht"}
            );
            context.SaveChanges();
        }
    }
}
