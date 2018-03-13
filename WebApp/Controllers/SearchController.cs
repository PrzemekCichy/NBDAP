
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApp.Controllers
{
    public class SearchController : Controller
    {

        [HttpGet("SearchController/search")]
        public void StartSearch()
        {
            var path = this.Request.Query.ElementAt(0).Key;

            AhoCorasick.Trie trie = new AhoCorasick.Trie();

            List<string> hashtags = new List<string>(){
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
            hashtags = hashtags.ConvertAll(d => d.ToUpper());

            trie.Add(hashtags);

            // build search tree
            trie.Build();
            Console.WriteLine("Trie built.");

            Search.Match(path, trie);

        }

        public static class Search
        {
            public static int TweetsFound= 0;
            public static int TweetsMatched=0;

            public static void Match(string path, AhoCorasick.Trie trie)
            {
                DirectoryInfo rootFolder = new DirectoryInfo(path);

                //Filter given directory for json files and add them to a list of files
                var files = rootFolder.EnumerateFiles("*.json", SearchOption.AllDirectories);

                Parallel.ForEach(files, new ParallelOptions { MaxDegreeOfParallelism = 16 }, (file1) =>
                {

                    int found = 0;
                    int matched = 0;
                    Console.WriteLine("Reading " + file1.FullName);
                    
                    var jsonText = System.IO.File.ReadAllText(file1.FullName);
                    var tweets = JsonConvert.DeserializeObject<IList<_Tweet>>(jsonText);
                    var matchedTweets = new List<_Tweet>();
                    for (var i = 0; i < tweets.Count; i++) { 
                        if (tweets[i] == null) {
                            continue;
                        }
                        found++;
                        // find words
                        foreach (string word in trie.Find(tweets[i].Text.ToUpper()))
                        {
                            matched++;
                            matchedTweets.Add(tweets[i]);
                        }
                    }
                    Interlocked.Add(ref TweetsFound, found);
                    Interlocked.Add(ref TweetsMatched, matched);
                    using (StreamWriter sw = new StreamWriter(file1.DirectoryName + "/Matched" + file1.Name + ".txt"))
                    {
                        sw.Write(JsonConvert.SerializeObject(matchedTweets, Formatting.Indented));
                        // sw.Write(JsonConvert.SerializeObject(objectToSerialize, Formatting.Indented));

                    }
                });
                using (StreamWriter sw = new StreamWriter(path + "/MatchedStats.txt"))
                {
                    sw.Write("Tweets Found: " + TweetsFound + " Tweets Matched: " + TweetsMatched);
                    // sw.Write(JsonConvert.SerializeObject(objectToSerialize, Formatting.Indented));
                    Interlocked.Increment(ref TweetsFound);
                }
            }
        }

    }
}