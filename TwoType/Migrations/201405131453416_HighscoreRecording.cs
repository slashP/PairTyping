namespace TwoType.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class HighscoreRecording : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.HighscoreRecordings",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Name = c.String(),
                        PlayTime = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Recordings = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.HighscoreRecordings");
        }
    }
}
