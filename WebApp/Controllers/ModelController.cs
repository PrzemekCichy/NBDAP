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
using static WebApp.Controllers.SearchController;

class MultiSentimentAnalysisResults : SentimentAnalysisResults
{
    public MultiSentimentAnalysisResults(SentimentAnalysisResults old)
    {
        this.Compound += old.Compound;
        this.Negative += old.Negative;
        this.Neutral += old.Neutral;
        this.Positive += old.Positive;
    }
    public double Occurences { get; set; } = 1;
}

namespace WebApp.Controllers
{
    public class ModelController : Controller
    {
        [HttpGet("ModelController/StartVader")]
        public JsonResult StartVader(string path)
        {
            Console.WriteLine("Start Test Modeling");

            var fileName = this.Request.Query.ElementAt(0).Key;

            SentimentIntensityAnalyzer testAnalyzer = new SentimentIntensityAnalyzer();

            List<SentimentAnalysisResults> testResults = new List<SentimentAnalysisResults>
            {
                testAnalyzer.PolarityScores("HAPPY INDEPENDENCE DAY TO THE UNITED KINGDOM.  Our turn now. #Trump2016 #Trump"),
                testAnalyzer.PolarityScores("behold #drumpf. He's like an infinite mirror image of turds stretching to infinity. The jokes within the jokes etc."),
                testAnalyzer.PolarityScores("It took 2 cars, an airplane, and 625 miles but I made it back in time to NYC to proudly cast my vote. #ImWithHer"),
                testAnalyzer.PolarityScores("I would love to see Attorney General Chris Christie...prosecute the hell out of Hillary Clinton! #LockHerUP!"),
                testAnalyzer.PolarityScores("I'm voting for Hillary Clinton -- and against Donald Trump #ImWithHer #NeverTrump"),
                testAnalyzer.PolarityScores("Proof that #Hillary is #Racist. Thank the #Lord that #Trump is #AlmostPresident. Counting Down #Trump2016 #LockHerUP")
            };

            using (StreamWriter sw = new StreamWriter(Path.GetDirectoryName(fileName) + "/VADER_Test_" + Path.GetFileNameWithoutExtension(fileName) + ".txt"))
            {
                sw.WriteLine(JsonConvert.SerializeObject(testResults));
            }

            Console.WriteLine("Start Vader " + DateTime.Now);

            SentimentIntensityAnalyzer analyzer = new SentimentIntensityAnalyzer();

            ConcurrentDictionary<string, MultiSentimentAnalysisResults> tweetList = new ConcurrentDictionary<string, MultiSentimentAnalysisResults>();

            //System.IO.File.SetAttributes(Path.GetDirectoryName(fileName), FileAttributes.Normal);

            Parallel.ForEach(System.IO.File.ReadLines(fileName), new ParallelOptions { MaxDegreeOfParallelism = 32 }, (line, _, lineNumber) =>
            {
                try
                {
                    var tweet = JsonConvert.DeserializeObject<_Tweet>(line);

                    var results = new MultiSentimentAnalysisResults(analyzer.PolarityScores(tweet.Text));

                    string timestamp = (Math.Ceiling(Decimal.Parse(tweet.TimestampMs) / 6000) * 6000).ToString();

                    if (!tweetList.TryAdd(timestamp, results))
                    {
                        //key exists, failed to add, lets average
                        //Console.WriteLine("Multiple keys");
                        MultiSentimentAnalysisResults value;
                        tweetList.TryGetValue(timestamp, out value);
                        results.Compound += value.Compound;
                        results.Negative += value.Negative;
                        results.Neutral += value.Neutral;
                        results.Occurences += value.Occurences + 1;
                        results.Positive += value.Positive;
                        if (tweetList.TryUpdate(timestamp, results, value))
                        {
                            //Console.WriteLine("Updated multiple keys");
                        };
                    }
                }
                catch (Exception e)
                {
                    //Console.WriteLine("Error ");
                }

            });


            foreach (KeyValuePair<string, MultiSentimentAnalysisResults> pair in tweetList)
            {
                if (pair.Value.Occurences <= 1) continue;

                pair.Value.Negative /= pair.Value.Occurences;
                pair.Value.Compound /= pair.Value.Occurences;
                pair.Value.Neutral /= pair.Value.Occurences;
                pair.Value.Positive /= pair.Value.Occurences;
            }


            using (StreamWriter sw = new StreamWriter(Path.GetDirectoryName(fileName) + "/VADER_" + Path.GetFileNameWithoutExtension(fileName) + ".txt"))
            {
                sw.WriteLine(JsonConvert.SerializeObject(tweetList));
            }


            Console.WriteLine("Finished Vader " + DateTime.Now);

            // time + score
            return new JsonResult(new { success = true, responseText = "Finished Modeling." });
        }

        [HttpGet("ModelController/StartModeling")]
        public JsonResult StartModeling(string filePath)
        {

            var fileName = this.Request.Query.ElementAt(0).Key;

            ConcurrentDictionary<string, Dictionary<string, int>> tweetList = new ConcurrentDictionary<string, Dictionary<string, int>>();


            AhoCorasick.Trie trie = new AhoCorasick.Trie();

            List<string> hashtags = new List<string>(){
                "alwaystrump",
                "babesfortrump",
                "bikers4trump",
                "bikersfortrump",
                "blacks4trump",
                "buildthatwall",
                "buildthewall",
                "cafortrump",
                "democrats4trump",
                "donuldtrumpforpresident",
                "feelthetrump",
                "femineamerica4trump",
                "gays4trump",
                "gaysfortrump",
                "gotrump",
                "heswithus",
                "imwithhim",
                "imwithyou",
                "latinos4trump",
                "latinosfortrump",
                "maga",
                "makeamericagreat",
                "makeamericagreatagain",
                "makeamericasafeagain",
                "makeamericaworkagain",
                "onlytrump",
                "presienttrump",
                "rednationrising",
                "trump16",
                "trump2016",
                "trumpcares",
                "trumpforpresident",
                "trumpiswithyou",
                "trumppence2016",
                "trumpstrong",
                "trumptrain",
                "veteransfortrump",
                "vets4trump",
                "votegop",
                "votetrump",
                "votetrump2016",
                "votetrumppence2016",
                "woman4trump",
                "women4trump",
                "womenfortrump",
                "antitrump",
                "anyonebuttrump",
                "boycotttrump",
                "chickentrump",
                "clowntrain",
                "crookeddonald",
                "crookeddrumpf",
                "crookedtrump",
                "crybabytrump",
                "defeattrump",
                "dirtydonald",
                "donthecon",
                "drumpf",
                "dumbdonald",
                "dumpthetrump",
                "dumptrump",
                "freethedelegates",
                "lgbthatestrumpparty",
                "loserdonald",
                "losertrump",
                "lovetrumpshate",
                "lovetrumpshates",
                "lyindonald",
                "lyingdonald",
                "lyingtrump",
                "lyintrump",
                "makedonalddrumpfagain",
                "nevergop",
                "nevertrump",
                "nevertrumppence",
                "nodonaldtrump",
                "notrump",
                "notrumpanytime",
                "poordonald",
                "racisttrump",
                "releasethereturns",
                "releaseyourtaxes",
                "ripgop",
                "showusyourtaxes",
                "sleazydonald",
                "stoptrump",
                "stupidtrump",
                "traitortrump",
                "treasonoustrump",
                "trump20never",
                "trumplies",
                "trumpliesmatter",
                "trumpsopoor",
                "trumpthefraud",
                "trumptrainwreck",
                "trumptreason",
                "unfittrump",
                "weakdonald",
                "wherertrumpstaxes",
                "wheresyourtaxes",
                "whinylittlebitch",
                "womentrumpdonald",
                "bernwithher",
                "bluewave2016",
                "clintonkaine2016",
                "estoyconella",
                "herstory",
                "heswithher",
                "hillafornia",
                "hillary2016",
                "hillaryforamerica",
                "hillaryforpr",
                "hillaryforpresident",
                "hillarysopresidential",
                "hillarysoqualified",
                "hillarystrong",
                "hillstorm2016",
                "hillyes",
                "hrc2016",
                "hrcisournominee",
                "iamwithher",
                "imwither",
                "imwithher",
                "imwithher2016",
                "imwhithhillary",
                "imwiththem",
                "itrusther",
                "itrusthillary",
                "madamepresident",
                "madampresident",
                "momsdemandhillary",
                "ohhillyes",
                "readyforhillary",
                "republicans4hillary",
                "republicansforhillary",
                "sheswithus",
                "standwithmadampotus",
                "strongertogether",
                "uniteblue",
                "vote4hillary",
                "voteblue",
                "voteblue2016",
                "votehillary",
                "welovehillary",
                "yeswekaine",
                "clintoncorruption",
                "clintoncrime",
                "clintoncrimefamily",
                "clintoncrimefoundation",
                "corrupthillary",
                "criminalhillary",
                "crookedclinton",
                "crookedclintons",
                "crookedhilary",
                "crookedhiliary",
                "crookedhillary",
                "crookedhillaryclinton",
                "deletehillary",
                "dropouthillary",
                "fbimwithher",
                "handcuffhillary",
                "heartlesshillary",
                "hillary2jail",
                "hillary4jail",
                "hillary4prison",
                "hillary4prison2016",
                "hillaryforprison",
                "hillaryforprison2016",
                "hillaryliedpeopledied",
                "hillarylies",
                "hillaryliesmatter",
                "hillarylosttome",
                "hillaryrottenclinton",
                "hillarysolympics",
                "hillno",
                "hypocritehillary",
                "imnotwithher",
                "indicthillary",
                "iwillneverstandwithher",
                "killary",
                "lockherup",
                "lyingcrookedhillary",
                "lyinghillary",
                "lyinhillary",
                "moretrustedthanhillary",
                "neverclinton",
                "nevereverhillary",
                "neverhillary",
                "neverhilllary",
                "nohillary2016",
                "nomoreclintons",
                "notwithher",
                "ohhillno",
                "releasethetranscripts",
                "riskyhillary",
                "shelies",
                "sickhillary",
                "stophillary",
                "stophillary2016",
                "theclintoncontamination",
                "wehatehillary",
                "whatmakeshillaryshortcircuit"
              };

            hashtags = hashtags.ConvertAll(d => d.ToLower());

            for (int i = 0; i < hashtags.Count; i++)
            {
                trie.Add(hashtags[i], (i).ToString());
            }

            // build search tree
            trie.Build();

            Parallel.ForEach(System.IO.File.ReadLines(fileName), new ParallelOptions { MaxDegreeOfParallelism = 32 }, (line, _, lineNumber) =>
            {
                try
                {
                    var tweet = JsonConvert.DeserializeObject<_Tweet>(line);
                    var a = Proximity.Match(trie, hashtags, tweet.Text.ToLower());
                    if (a.Count != 0)
                    {

                        Dictionary<string, List<string>> tags = new Dictionary<string, List<string>>(){
                        {
                            "Pro-Trump", new List<string>(){
                            "trump",
                            "clinton",
                            "alwaystrump",
                            "babesfortrump",
                            "bikers4trump",
                            "bikersfortrump",
                            "blacks4trump",
                            "buildthatwall",
                            "buildthewall",
                            "cafortrump",
                            "democrats4trump",
                            "donuldtrumpforpresident",
                            "feelthetrump",
                            "femineamerica4trump",
                            "gays4trump",
                            "gaysfortrump",
                            "gotrump",
                            "heswithus",
                            "imwithhim",
                            "imwithyou",
                            "latinos4trump",
                            "latinosfortrump",
                            "maga",
                            "makeamericagreat",
                            "makeamericagreatagain",
                            "makeamericasafeagain",
                            "makeamericaworkagain",
                            "onlytrump",
                            "presienttrump",
                            "rednationrising",
                            "trump16",
                            "trump2016",
                            "trumpcares",
                            "trumpforpresident",
                            "trumpiswithyou",
                            "trumppence2016",
                            "trumpstrong",
                            "trumptrain",
                            "veteransfortrump",
                            "vets4trump",
                            "votegop",
                            "votetrump",
                            "votetrump2016",
                            "votetrumppence2016",
                            "woman4trump",
                            "women4trump",
                            "womenfortrump"
                        }
                        }, {
                            "Anti-Trump", new List<string>(){
                                "antitrump",
                                "anyonebuttrump",
                                "boycotttrump",
                                "chickentrump",
                                "clowntrain",
                                "crookeddonald",
                                "crookeddrumpf",
                                "crookedtrump",
                                "crybabytrump",
                                "defeattrump",
                                "dirtydonald",
                                "donthecon",
                                "drumpf",
                                "dumbdonald",
                                "dumpthetrump",
                                "dumptrump",
                                "freethedelegates",
                                "lgbthatestrumpparty",
                                "loserdonald",
                                "losertrump",
                                "lovetrumpshate",
                                "lovetrumpshates",
                                "lyindonald",
                                "lyingdonald",
                                "lyingtrump",
                                "lyintrump",
                                "makedonalddrumpfagain",
                                "nevergop",
                                "nevertrump",
                                "nevertrumppence",
                                "nodonaldtrump",
                                "notrump",
                                "notrumpanytime",
                                "poordonald",
                                "racisttrump",
                                "releasethereturns",
                                "releaseyourtaxes",
                                "ripgop",
                                "showusyourtaxes",
                                "sleazydonald",
                                "stoptrump",
                                "stupidtrump",
                                "traitortrump",
                                "treasonoustrump",
                                "trump20never",
                                "trumplies",
                                "trumpliesmatter",
                                "trumpsopoor",
                                "trumpthefraud",
                                "trumptrainwreck",
                                "trumptreason",
                                "unfittrump",
                                "weakdonald",
                                "wherertrumpstaxes",
                                "wheresyourtaxes",
                                "whinylittlebitch",
                                "womentrumpdonald"
                            }
                        }, {
                            "Pro-Clinton", new List<string>(){
                                "bernwithher",
                                "bluewave2016",
                                "clintonkaine2016",
                                "estoyconella",
                                "herstory",
                                "heswithher",
                                "hillafornia",
                                "hillary2016",
                                "hillaryforamerica",
                                "hillaryforpr",
                                "hillaryforpresident",
                                "hillarysopresidential",
                                "hillarysoqualified",
                                "hillarystrong",
                                "hillstorm2016",
                                "hillyes",
                                "hrc2016",
                                "hrcisournominee",
                                "iamwithher",
                                "imwither",
                                "imwithher",
                                "imwithher2016",
                                "imwhithhillary",
                                "imwiththem",
                                "itrusther",
                                "itrusthillary",
                                "madamepresident",
                                "madampresident",
                                "momsdemandhillary",
                                "ohhillyes",
                                "readyforhillary",
                                "republicans4hillary",
                                "republicansforhillary",
                                "sheswithus",
                                "standwithmadampotus",
                                "strongertogether",
                                "uniteblue",
                                "vote4hillary",
                                "voteblue",
                                "voteblue2016",
                                "votehillary",
                                "welovehillary",
                                "yeswekaine",
                            }
                        }, {
                            "Anti-Clinton", new List<string>(){
                                 "clintoncorruption",
                                "clintoncrime",
                                "clintoncrimefamily",
                                "clintoncrimefoundation",
                                "corrupthillary",
                                "criminalhillary",
                                "crookedclinton",
                                "crookedclintons",
                                "crookedhilary",
                                "crookedhiliary",
                                "crookedhillary",
                                "crookedhillaryclinton",
                                "deletehillary",
                                "dropouthillary",
                                "fbimwithher",
                                "handcuffhillary",
                                "heartlesshillary",
                                "hillary2jail",
                                "hillary4jail",
                                "hillary4prison",
                                "hillary4prison2016",
                                "hillaryforprison",
                                "hillaryforprison2016",
                                "hillaryliedpeopledied",
                                "hillarylies",
                                "hillaryliesmatter",
                                "hillarylosttome",
                                "hillaryrottenclinton",
                                "hillarysolympics",
                                "hillno",
                                "hypocritehillary",
                                "imnotwithher",
                                "indicthillary",
                                "iwillneverstandwithher",
                                "killary",
                                "lockherup",
                                "lyingcrookedhillary",
                                "lyinghillary",
                                "lyinhillary",
                                "moretrustedthanhillary",
                                "neverclinton",
                                "nevereverhillary",
                                "neverhillary",
                                "neverhilllary",
                                "nohillary2016",
                                "nomoreclintons",
                                "notwithher",
                                "ohhillno",
                                "releasethetranscripts",
                                "riskyhillary",
                                "shelies",
                                "sickhillary",
                                "stophillary",
                                "stophillary2016",
                                "theclintoncontamination",
                                "wehatehillary",
                                "whatmakeshillaryshortcircuit"
                            }
                           }
                        };

                        Dictionary<string, int> similarity = new Dictionary<string, int>();

                        foreach (KeyValuePair<string, List<string>> pair in tags)
                        {
                            similarity.Add(pair.Key, 0);
                        }
                        int total = 0;

                        foreach (string word in a)
                        {
                            foreach (KeyValuePair<string, List<string>> category in tags)
                            {
                                if (category.Value.Contains(word))
                                {
                                    similarity[category.Key]++;
                                    total++;
                                }
                            }
                        }

                        Dictionary<string, int> similarityPercentage = new Dictionary<string, int>();

                        foreach (KeyValuePair<string, int> key in similarity)
                        {
                            similarityPercentage.Add(key.Key, (int)(((double)key.Value / total) * 100));
                        }
                        if (a.Count > 1)
                        {
                            Console.WriteLine();
                        }

                        tweetList.TryAdd(tweet.TimestampMs, similarityPercentage);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error ");
                }

            });

            using (StreamWriter sw = new StreamWriter(Path.GetDirectoryName(fileName) + "/SIMILARITY_" + Path.GetFileNameWithoutExtension(fileName) + ".txt"))
            {
                sw.WriteLine(JsonConvert.SerializeObject(tweetList));
            }

            Console.WriteLine("Finished Vader " + DateTime.Now);

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

        class Proximity
        {

            public static List<string> Match(AhoCorasick.Trie trie, List<string> hashtags, string text)
            {

                List<int> positions = new List<int>();

                foreach (string position in trie.Find(text))
                {
                    positions.Add(Int16.Parse(position));
                }

                //check if it is non alfa char                        
                var verifiedWords = new List<string>();
                if (positions.Count() == 0) return verifiedWords;

                foreach (int wordNo in positions)
                {
                    string word = hashtags.ElementAt(wordNo);
                    int startingPosition = text.IndexOf(word);
                    int endingPosition = startingPosition + word.Count();

                    //If beggining or end of text, assume its not english letter                            
                    bool front = startingPosition == 0 || (startingPosition != -1 && !Search.IsEnglishLetter(text.ElementAt(startingPosition - 1)));

                    bool end = endingPosition == text.Count() || (endingPosition != -1 && !Search.IsEnglishLetter(text.ElementAt(endingPosition)));

                    if (front && end)
                    {
                        verifiedWords.Add(word);
                    }
                }
                return verifiedWords;

            }

        }
    }
}