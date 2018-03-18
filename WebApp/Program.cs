using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Tweetinvi;
using Tweetinvi.Models;
using Tweetinvi.Parameters;

namespace WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {



            /*
             * "1",
             *   "1", 
             *   "2766150869-1", 
             *   "1"
             */
            var creditentials = Auth.SetUserCredentials("1", "1",
                "1-1", "1");

            //var user = Tweetinvi.User.GetAuthenticatedUser(creditentials);
            //Console.WriteLine(user);
            //var timeline = Timeline.GetUserTimeline(user, 1);
            //Console.WriteLine(timeline.ElementAt(0));

            //var searchParameter = new SearchTweetsParameters("bitcoin")
            //{
            //    //GeoCode = new GeoCode(-122.398720, 37.781157, 1, DistanceMeasure.Miles),
            //    Lang = LanguageFilter.English,
            //    SearchType = SearchResultType.Recent,
            //    MaximumNumberOfResults = 1000,
            //    //Until = new DateTime(2015, 06, 02,),
            //};

            //var tweets = Search.SearchTweets(searchParameter);
                       

                BuildWebHost(args).Run();
        }


        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
