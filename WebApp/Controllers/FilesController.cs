using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

namespace WebApp.Controllers
{
    public class FilesController : Controller
    {

        [HttpGet("FilesController/getFiles")]
        public JsonResult SendDirectoryPath(string directoryPath)
        {
            var path = this.Request.Query.ElementAt(0).Key;
            var a = Start();
            Dictionary<string, List<string>> students = new Dictionary<string, List<string>>()
            {
                { "Standard" , new List<string>(){ @"E:\Project\2015\New\01.json", @"E:\Project\2015\New\02.json" } },
                { "Compressed" , new List<string>(){@"E:\Project\2015\01.bz2"} }
            };

            JsonResult result = new JsonResult(students);

            return result;
        }

        [DllImport("TwitterPlatform.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern object Start();
    }
}
