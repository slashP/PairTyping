using System;

namespace TwoType.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class HighscoreEntry
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public decimal PlayTime { get; set; }
        public DateTime GameTime { get; set; }
    }

    public class HighscoreRecording
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal PlayTime { get; set; }
        public string Recordings { get; set; }
    }
}