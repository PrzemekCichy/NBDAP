using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Controllers
{
    public class FilesController: Controller
    {
        [HttpPost("FilesController/getFiles/")]
        public JsonResult GetFiles(string directoryPath) {
            //Run and return list of liles
            return new JsonResult(new List<object> {
               new  { name = "Test.json", path = "C:/Desktop" },
               new  { name = "Test2.json", path = "C:/Desktop/New" },
               new  { name = directoryPath, path = directoryPath }
            });
        }


        [HttpGet("FilesController/getFiles")]
        public JsonResult SendDirectoryPath(string directoryPath)
        {
            var path = this.Request.Query.ElementAt(0).Key;
            return new JsonResult(new List<object> {
               new  { name = "Test.json", path = "C:/Desktop" },
               new  { name = "Test2.json", path = "C:/Desktop/New" },
               new  { name = path, path = path }
            });
        }
    }
}
