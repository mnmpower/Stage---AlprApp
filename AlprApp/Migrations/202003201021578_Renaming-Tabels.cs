namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenamingTabels : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Cars", newName: "Car");
            RenameTable(name: "dbo.Companies", newName: "Company");
            RenameTable(name: "dbo.Messages", newName: "Message");
            RenameTable(name: "dbo.PersonCars", newName: "ComPersonCarpany");
            RenameTable(name: "dbo.People", newName: "Person");
            RenameTable(name: "dbo.PremadeMessages", newName: "PremadeMessage");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.PremadeMessage", newName: "PremadeMessages");
            RenameTable(name: "dbo.Person", newName: "People");
            RenameTable(name: "dbo.ComPersonCarpany", newName: "PersonCars");
            RenameTable(name: "dbo.Message", newName: "Messages");
            RenameTable(name: "dbo.Company", newName: "Companies");
            RenameTable(name: "dbo.Car", newName: "Cars");
        }
    }
}
