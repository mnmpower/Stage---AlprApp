namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPremadeMessageClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PremadeMessages",
                c => new
                    {
                        PremadeMessageID = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                    })
                .PrimaryKey(t => t.PremadeMessageID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.PremadeMessages");
        }
    }
}
