namespace AlprApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddMessageClass : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Messages",
                c => new
                    {
                        MessageID = c.Int(nullable: false, identity: true),
                        PersonCarID = c.Int(nullable: false),
                        PremadeMessageID = c.Int(),
                        Text = c.String(),
                    })
                .PrimaryKey(t => t.MessageID)
                .ForeignKey("dbo.PersonCars", t => t.PersonCarID)
                .ForeignKey("dbo.PremadeMessages", t => t.PremadeMessageID)
                .Index(t => t.PersonCarID)
                .Index(t => t.PremadeMessageID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Messages", "PremadeMessageID", "dbo.PremadeMessages");
            DropForeignKey("dbo.Messages", "PersonCarID", "dbo.PersonCars");
            DropIndex("dbo.Messages", new[] { "PremadeMessageID" });
            DropIndex("dbo.Messages", new[] { "PersonCarID" });
            DropTable("dbo.Messages");
        }
    }
}
