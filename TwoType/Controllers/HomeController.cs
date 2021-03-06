﻿using System.Web.Mvc;

namespace TwoType.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult ViewHighscore(int id)
        {
            return View();
        }

        public ActionResult RandomWinner()
        {
            return View();
        }
    }

}