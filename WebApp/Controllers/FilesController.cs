using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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
            var watch = System.Diagnostics.Stopwatch.StartNew();

            var a = Directory.GetFiles(path, "*.json", SearchOption.AllDirectories); //Start("E:\\Project\\2015\\06\\01\\00"); 
            var b = Directory.GetFiles(path, "*.bz2", SearchOption.AllDirectories);

            Console.WriteLine(watch.ElapsedMilliseconds);

            Dictionary<string, int> files = new Dictionary<string, int>()
            {
                { "Standard" , a.Count() },
                { "Compressed" , b.Count() }
            };

            JsonResult result = new JsonResult(files);

            return result;
        }

        [HttpGet("FilesController/decompressFiles")]
        public void DecompressFiles()
        {

            var path = this.Request.Query.ElementAt(0).Key;
            var watch = System.Diagnostics.Stopwatch.StartNew();

            Decompress.TransverseDirectory(path);

            Debug.WriteLine(watch.ElapsedMilliseconds);

            //JsonResult result = new JsonResult();

            //return result;
        }

        [DllImport("TwitterPlatform.dll",
            EntryPoint = "?Start@Start@@QAEXH@Z",
            CallingConvention = CallingConvention.ThisCall)]
        public static extern object Start(string path);

        [DllImport("TwitterPlatform.dll")]
        static public extern IntPtr CreateMyTestClass();

        [DllImport("TwitterPlatform.dll")]
        static public extern void DisposeMyTestClass(IntPtr object1);

        [DllImport("TwitterPlatform.dll")]
        static public extern int CallMyMethod(IntPtr object1, int nValue);


    }
}
