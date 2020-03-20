namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPersonCarClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PersonCars",
                c => new
                    {
                        PersonCarID = c.Int(nullable: false, identity: true),
                        PersonID = c.Int(nullable: false),
                        CarID = c.Int(nullable: false),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PersonCarID)
                .ForeignKey("dbo.Cars", t => t.CarID)
                .ForeignKey("dbo.People", t => t.PersonID)
                .Index(t => t.PersonID)
                .Index(t => t.CarID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PersonCars", "PersonID", "dbo.People");
            DropForeignKey("dbo.PersonCars", "CarID", "dbo.Cars");
            DropIndex("dbo.PersonCars", new[] { "CarID" });
            DropIndex("dbo.PersonCars", new[] { "PersonID" });
            DropTable("dbo.PersonCars");
        }
    }
}
