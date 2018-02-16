using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Controllers
{
    public class FilesController: Controller
    {
        [HttpGet("FilesController/getFiles")]
        public JsonResult GetFiles() {
            return new JsonResult(new List<object> {
               new  { name = "Test.json", path = "C:/Desktop" },
               new  { name = "Test2.json", path = "C:/Desktop/New" },
            });
        }
    }
}
