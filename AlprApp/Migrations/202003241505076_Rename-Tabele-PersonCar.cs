namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameTabelePersonCar : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.ComPersonCarpany", newName: "PersonCar");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.PersonCar", newName: "ComPersonCarpany");
        }
    }
}
