using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using VaderSharp;

namespace WebApp.Controllers
{
    public class ModelController : Controller
    {
        [HttpGet("ModelController/StartVader")]
        public JsonResult StartVader(string path)
        {
            Console.WriteLine("Start Vader " + DateTime.Now);
            //Get classes 
            var fileName = this.Request.Query.ElementAt(0).Key;

            SentimentIntensityAnalyzer analyzer = new SentimentIntensityAnalyzer();

            ConcurrentBag<Dictionary<string, SentimentAnalysisResults>> tweetList = new ConcurrentBag<Dictionary<string, SentimentAnalysisResults>>();

            Parallel.ForEach(System.IO.File.ReadLines(fileName), new ParallelOptions { MaxDegreeOfParallelism = 32 }, (line, _, lineNumber) =>
            {
                try
                {
                    var tweet = JsonConvert.DeserializeObject<_Tweet>(line);

                    var results = analyzer.PolarityScores(tweet.Text);
                    tweetList.Add(new Dictionary<string, SentimentAnalysisResults>() { { tweet.TimestampMs, results } });
                }
                catch (Exception e) {
                    Console.WriteLine("Error ");
                }

            });
            
            using (StreamWriter sw = new StreamWriter(Path.GetDirectoryName(fileName) + "/VADER_" + Path.GetFileNameWithoutExtension(fileName) + ".txt"))
            {
                sw.WriteLine( JsonConvert.SerializeObject(tweetList));
            }


            Console.WriteLine("Finished Vader " + DateTime.Now);

            // time + score
            return new JsonResult(new { success = true, responseText = "Finished Modeling." });
        }

        [HttpGet("ModelController/StartModeling")]
        public JsonResult StartModeling(string filePath)
        {
            Console.WriteLine("Start Modeling");

            SentimentIntensityAnalyzer analyzer = new SentimentIntensityAnalyzer();

            Parallel.ForEach(System.IO.File.ReadLines(filePath), (line, _, lineNumber) =>
            {
                var results = analyzer.PolarityScores(line);
            });

            return new JsonResult(new { success = true, responseText = "Finished Modeling." });
        }

        [HttpGet("ModelController/StartPythonScript")]
        public JsonResult RunPythonScript(string test)
        {
            Console.WriteLine("Run Python");
            try
            {
                ProcessStartInfo pythonInfo = new ProcessStartInfo();
                Process python;
                pythonInfo.FileName = @"C:\Users\Przemek\Source\Repos\TwitterPLatform\PythonClassifier\PythonClassifier.py";
                //pythonInfo.Arguments = string.Format("{0} {1}", cmd, args);
                pythonInfo.CreateNoWindow = false;
                pythonInfo.UseShellExecute = true;

                Console.WriteLine("Running Python Classifier...");
                python = Process.Start(pythonInfo);
                python.WaitForExit();
                python.Close();
                Console.WriteLine("Finished Running Python Classifier...");

                return new JsonResult(new { success = true, responseText = "Finished executing python script." });
            }
            catch (Exception e)
            {
                return new JsonResult(new { success = false, responseText = "Failed to execute python script." });
            }

        }
    }
}