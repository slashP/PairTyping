using System;

namespace TwoType.Models
{
    public class HighscoreEntry
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Name2 { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public decimal PlayTime { get; set; }
        public DateTime GameTime { get; set; }
    }
}