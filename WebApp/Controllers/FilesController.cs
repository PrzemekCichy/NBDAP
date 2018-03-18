using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace WebApp.Controllers
{
    public class FilesController : Controller
    {

        [HttpGet("FilesController/getFiles")]
        public JsonResult SendDirectoryPath(string directoryPath)
        {
            var path = this.Request.Query.ElementAt(0).Key;
            var watch = System.Diagnostics.Stopwatch.StartNew();

            var a = Directory.GetFiles(path, "*", SearchOption.AllDirectories);
            //a.Where(item => item.ToLower().Contains(".json"));
            //var b = Directory.GetFiles(path, "*.bz2", SearchOption.AllDirectories);

            Console.WriteLine(watch.ElapsedMilliseconds);

            Dictionary<string, int> files = new Dictionary<string, int>()
            {
                { "Standard" , a.Where(item => item.ToLower().Contains(".json")).Count() },
                { "Compressed" , a.Where(item => item.ToLower().Contains(".bz2")).Count() },
                { "Filtered" , a.Where(item => item.ToLower().Contains("matched")).Count() },
                { "API" , a.Where(item => item.ToLower().Contains("API_")).Count() },
                { "Stats" , a.Where(item => item.ToLower().Contains("stats")).Count() },
                { "Total" , a.Count() }
            };

            JsonResult result = new JsonResult(files);

            return result;
        }

        [HttpGet("FilesController/decompressFiles")]
        public async Task DecompressFiles()
        {


            var path = this.Request.Query.ElementAt(0).Key;
            var watch = System.Diagnostics.Stopwatch.StartNew();
            var t = Task.Run(() => Decompress.TransverseDirectory(path));
            //t.Wait();
            await t;

            Debug.WriteLine(watch.ElapsedMilliseconds);

            //JsonResult result = new JsonResult();

            //return result;
        }

        public Thread t;

        [HttpPost("FilesController/startStream")]
        public JsonResult StartStream(string[] list)
        {
            try
            {
                var keyword = list[0];
                var path = list[1];                
                this.t = new Thread(() =>
                {
                    var stream = Tweetinvi.Stream.CreateFilteredStream();
                    if(keyword != "") stream.AddTrack(keyword);
                    for (; ; )
                    {
                        stream.MatchingTweetReceived += (sender, args) =>
                        {
                            System.IO.File.AppendAllText(path, args.Json + "\n");
                        };
                        stream.StartStreamMatchingAllConditions();
                    }
                });
                t.Start();
                return new JsonResult(new { success = true, responseText = "Started stream for keyword" + keyword + ". Saving to file at location " + path + "." });
            }
            catch (Exception e)
            {
                return Json(new { success = false, responseText = "Exceptions occured while attempting to open stream." });
            }
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
