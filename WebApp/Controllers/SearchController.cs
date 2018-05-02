
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

            hashtags = hashtags.ConvertAll(d => d.ToLower());

            for (int i = 0; i < hashtags.Count; i++)
            {
                trie.Add(hashtags[i], (i).ToString());
            }

            // build search tree
            trie.Build();
            Console.WriteLine("Trie built.");

            Search.Match(path, trie, hashtags);

        }

        public static class Search
        {

            public static object keywordLock = new object();
            public static int TweetsFound = 0;
            public static int TweetsMatched = 0;

            //Create a data structure for no of occurrences of each searched word
            public static Dictionary<string, int> tags;

            //We need to check whether the world is not a sub word.
            //We do it after the word is matched using aho-corasick
            public static bool IsEnglishLetter(char c)
            {
                return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
            }

            /// <summary>
            /// 
            /// </summary>
            /// <param name="path"></param>
            /// <param name="trie"></param>
            /// <param name="capitalizedHashtags"></param>
            /// <param name="hashtags"></param>
            public static void Match(string path, AhoCorasick.Trie trie, List<string> hashtags)
            {

                DirectoryInfo rootFolder = new DirectoryInfo(path);
                var files = rootFolder.EnumerateFiles("*.json", SearchOption.AllDirectories);

                tags = hashtags.ToDictionary(x => x, x => 0);

                Parallel.ForEach(files, new ParallelOptions { MaxDegreeOfParallelism = 16 }, (file1) =>
                {
                    int found = 0;
                    int matched = 0;

                    Console.WriteLine("Reading " + file1.FullName);

                    var jsonText = System.IO.File.ReadAllText(file1.FullName);
                    var tweets = JsonConvert.DeserializeObject<IList<_Tweet>>(jsonText);

                    var matchedTweets = new List<string>();
                    for (var i = 0; i < tweets.Count; i++)
                    {
                        String text = tweets[i].Text.ToLower();

                        if (tweets[i] == null) continue;

                        List<int> positions = new List<int>();

                        foreach (string position in trie.Find(text))
                        {
                            positions.Add(Int16.Parse(position));
                        }

                        found++;

                        if (positions.Count() == 0) continue;

                        //check if it is non alfa char                        
                        var verifiedWords = new List<string>();

                        foreach (int wordNo in positions)
                        {
                            string word = hashtags.ElementAt(wordNo);
                            int startingPosition = text.IndexOf(word);
                            int endingPosition = startingPosition + word.Count();

                            //If beggining or end of text, assume its not english letter                            
                            bool front = startingPosition == 0 || (startingPosition != -1 && !IsEnglishLetter(text.ElementAt(startingPosition - 1)));

                            bool end = endingPosition == text.Count() || (endingPosition != -1 && !IsEnglishLetter(text.ElementAt(endingPosition)));

                            if (front && end){
                                verifiedWords.Add(word);

                            } else {
                                continue;
                            }
                        }
                        if (verifiedWords.Count == 0) {
                            continue;
                        }

                        matched++;
                        matchedTweets.Add(JsonConvert.SerializeObject(tweets[i]));

                        //Check if what happens here is correct
                        foreach (string word in verifiedWords)
                        {
                            lock (keywordLock)
                            {
                                tags[word] += 1;
                            }
                        }
                    }

                    Interlocked.Add(ref TweetsFound, found);
                    Interlocked.Add(ref TweetsMatched, matched);
                    System.IO.File.WriteAllLines(file1.DirectoryName + "/Matched" + file1.Name + ".txt", matchedTweets);

                });

                bool mergeIntoOneFile = true;
                if (mergeIntoOneFile) MergeSearchResults(path, "output.txt");


                using (StreamWriter sw = new StreamWriter(path + "/SearchStats.txt"))
                {
                    sw.Write("Tweets Found: " + TweetsFound + "\n Tweets Matched: " + TweetsMatched + "\n");
                    sw.Write(JsonConvert.SerializeObject(tags, Formatting.Indented));
                    // sw.Write(JsonConvert.SerializeObject(objectToSerialize, Formatting.Indented));
                    Interlocked.Increment(ref TweetsFound);
                }
            }
        }

        public static void MergeSearchResults(string path, string outputName)
        {
            var files = new DirectoryInfo(path).EnumerateFiles("*.txt", SearchOption.AllDirectories).Where(item => item.Name.ToLower().Contains("matched"));

            //Go through directory and get files
            //Concatinate the files
            using (var output = System.IO.File.Create(path + "/" + outputName))
            {
                foreach (var file in files)
                {
                    using (var input = System.IO.File.OpenRead(file.FullName))
                    {
                        input.CopyTo(output);
                    }
                    System.IO.File.Delete(file.FullName);
                }
            }


        }

    }
}