namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCarClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cars",
                c => new
                    {
                        CarID = c.Int(nullable: false, identity: true),
                        CompanyID = c.Int(nullable: false),
                        LicensePlate = c.String(),
                    })
                .PrimaryKey(t => t.CarID)
                .ForeignKey("dbo.Companies", t => t.CompanyID)
                .Index(t => t.CompanyID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Cars", "CompanyID", "dbo.Companies");
            DropIndex("dbo.Cars", new[] { "CompanyID" });
            DropTable("dbo.Cars");
        }
    }
}
