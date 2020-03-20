namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCompanyClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        CompanyID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Street = c.String(),
                        Number = c.String(),
                        PostalCode = c.String(),
                    })
                .PrimaryKey(t => t.CompanyID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Companies");
        }
    }
}
