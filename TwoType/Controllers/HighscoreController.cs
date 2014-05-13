﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using TwoType.Models;

namespace TwoType.Controllers
{
    public class HighscoreController : ApiController
    {
        [HttpGet]
        [Route("api/highscore")]
        public async Task<IEnumerable<HighscoreEntry>> Get()
        {
            List<HighscoreEntry> highscores;
            using (var db = new DataContext())
            {
                highscores = await db.HighscoreEntries.OrderBy(x => x.PlayTime).Take(20).ToListAsync();
            }
            return highscores;
        }

        [HttpPost]
        [Route("api/highscore")]
        public async Task<IEnumerable<HighscoreEntry>> Post(HighscoreEntry highscore)
        {
            if (string.IsNullOrEmpty(highscore.Name) || string.IsNullOrEmpty(highscore.Phone) || highscore.PlayTime == 0)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            using (var db = new DataContext())
            {
                highscore.GameTime = DateTime.UtcNow;
                db.HighscoreEntries.Add(highscore);
                await db.SaveChangesAsync();
            }
            return await Get();
        }

        [HttpGet]
        [Route("api/highscore")]
        public async Task<HighscoreRecording> GetRecording(int id)
        {
            using (var db = new DataContext())
            {
                return await db.HighscoreRecordings.FirstAsync(x => x.Id == id);
            }
        }

        [HttpPost]
        [Route("api/highscore/recording")]
        public async void PostRecording(HighscoreRecording recording)
        {
            if (string.IsNullOrEmpty(recording.Name) || recording.PlayTime == 0)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            using (var db = new DataContext())
            {
                db.HighscoreRecordings.Add(recording);
                await db.SaveChangesAsync();
            }
        }
    }
}