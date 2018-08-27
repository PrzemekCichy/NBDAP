
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
        public class ItemGroup
        {
            public string Path { get; set; }

            public SearchParams Tags { get; set; }
        }

        public class SearchParams
        {
            public List<string> Text { get; set; }
            public Object Reply { get; set; }
            public Object Hashtags { get; set; }
            public Object User { get; set; }

        }

        [HttpPost("SearchController/search")]
        public void StartSearch([FromBody] ItemGroup data)
        {
            var path = data.Path;

            AhoCorasick.Trie trie = new AhoCorasick.Trie();

            List<string> hashtags = data.Tags.Text as List<string>;

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
                    IList<_Tweet> tweets;

                    try
                    {
                        tweets = JsonConvert.DeserializeObject<IList<_Tweet>>(jsonText);
                    } catch (Exception E)
                    {
                        return;
                    }

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

                            if (front && end)
                            {
                                verifiedWords.Add(word);

                            }
                            else
                            {
                                continue;
                            }
                        }
                        if (verifiedWords.Count == 0)
                        {
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


                using (StreamWriter sw = new StreamWriter(path + "/Search_stats.txt"))
                {
                    sw.Write(JsonConvert.SerializeObject(new Stats
                    {
                        Found = TweetsFound,
                        Matched = TweetsMatched,
                        Results = tags
                    }, Formatting.Indented));
                    // sw.Write(JsonConvert.SerializeObject(objectToSerialize, Formatting.Indented));
                    Interlocked.Increment(ref TweetsFound);
                }
            }
        }
        class Stats
        {
            public int Found { get; set; }

            public int Matched { get; set; }

            public Object Results { get; set; }
        }

        public static void MergeSearchResults(string path, string outputName)
        {
            var files = new DirectoryInfo(path).EnumerateFiles("*.txt", SearchOption.AllDirectories).Where(item => item.Name.ToLower().Contains("matched"));

            //Go through directory and get files
            //Concatinate the files
            using (var output = System.IO.File.Create(path + "/" + "FILTERED_" + outputName))
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