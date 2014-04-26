using System.Data.Entity;

namespace TwoType.Models
{
    public class DataContext : DbContext
    {
        public DataContext() : base("DefaultConnection")
        {
        }

        public IDbSet<HighscoreEntry> HighscoreEntries { get; set; }
    }
}