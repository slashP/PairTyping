namespace TwoType.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TwoNameAndPhones : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.HighscoreEntries", "Name2", c => c.String());
            AddColumn("dbo.HighscoreEntries", "Phone2", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.HighscoreEntries", "Phone2");
            DropColumn("dbo.HighscoreEntries", "Name2");
        }
    }
}
