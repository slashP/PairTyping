namespace TwoType.Models
{
    using System.Collections.Generic;

    public class Highscores
    {
        public IEnumerable<HighscoreEntry> HighscoreEntries { get; set; }

        public HighscoreEntry CurrentEntry { get; set; }
    }
}