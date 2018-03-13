using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ICSharpCode.SharpZipLib.BZip2;
using System.Collections.Concurrent;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.Threading;

namespace WebApp
{
    public static class Decompress
    {
        public static void TransverseDirectory(string path)
        {
            DirectoryInfo rootFolder = new DirectoryInfo(path);
            int noOfFilesRead = 0;
            int noOfFilesDecompressed = 0;
            int noOfCorruptedFiles = 0;
            string failedPaths = "";

            //Filter given directory for bz2 files and add them to a list of files
            var files = rootFolder.EnumerateFiles("*.bz2", SearchOption.AllDirectories);

            //Decompress each .bz2 file, read lines and filter tweets matching the search criteria
            //Set parrarel options to no of cores availible
            Parallel.ForEach(files, new ParallelOptions { MaxDegreeOfParallelism = 16 }, (file) =>
            {
                bool failed = false;

                Console.WriteLine("Reading " + file.FullName);
                //Open file stream to a compressed bz2 file
                using (FileStream compressedStream = new FileStream(file.FullName, FileMode.Open))
                {
                    //Create a byte buffer holding uncompressed stream bytes
                    //For safety purposes the length of uncompressed stream is 30 to account the size increase when file is decompressed
                    //There must be a better way to do it, BZip2.Decompress doesnt seem to accept resizable buffers?
                    //Memory is not a big issue for now anyway
                    byte[] uBuffer = new byte[compressedStream.Length * 25];

                    //Creates memory stream to hold the uncompressed data           
                    MemoryStream uncompressedStream = new MemoryStream(uBuffer);

                    //Decompresses into memory stream which stores bytes in uncompressedBuffer
                    try
                    {
                        BZip2.Decompress(compressedStream, uncompressedStream, true);
                    }
                    catch (Exception e)
                    {
                        failedPaths += file.DirectoryName + "-" + file.FullName + e.ToString() + " \n";
                        failed = true;
                    }
                    if (!failed)
                    {
                        //Long string containing the uncompressed data
                        string sUncompressed = Encoding.ASCII.GetString(uBuffer);

                        var enableMinify = true;

                        if (enableMinify == true)
                        {
                            using (StreamWriter sw = new StreamWriter(file.FullName.Replace(".json.bz2", "") + ".json"))
                            {
                                sw.Write(JsonConvert.SerializeObject(Minify(sUncompressed, file.FullName), Formatting.None));
                            }
                        }
                        else
                        {
                            using (StreamWriter sw = new StreamWriter(file.FullName.Replace(".json.bz2", "") + ".json"))
                            {
                                //Bug: The trimEnd method does not work for some reason....
                                sw.Write(sUncompressed);
                            }
                        }
                    }
                    Console.WriteLine("Finished reading " + file.FullName);

                }
                if (!failed)
                {
                    if (File.Exists(file.FullName))
                    {
                        File.Delete(file.FullName);
                    }
                }
            });
            Console.WriteLine("noOfFilesRead {0} \n noOfFilesDecompressed {1} \n  noOfCorruptedFiles {2} \n  failedPaths {3} \n ", noOfFilesRead, noOfFilesDecompressed, noOfCorruptedFiles, failedPaths);
            //Task.WaitAll(fileTask);
        }

        public static object errorLock = new object();

        public static ConcurrentBag<_Tweet> Minify(string sUncompressed, string fileName)
        {
            ConcurrentBag<_Tweet> tweetList = new ConcurrentBag<_Tweet>();

            var inputLines = new BlockingCollection<string>();

            var readLines = Task.Factory.StartNew(() =>
            {
                //Split the string into lines and add them to a list
                var result = Regex.Split(sUncompressed, "\r\n|\r|\n");
                foreach (var line in result)
                {
                    inputLines.Add(line);
                }
                inputLines.CompleteAdding();
            });

            //Try to deserialize each line from the list
            var processLines = Task.Factory.StartNew(() =>
            {
                Parallel.ForEach(inputLines.GetConsumingEnumerable(), new ParallelOptions { MaxDegreeOfParallelism = 5 }, line =>
                {
                    //Do some logic operations in here       
                    try
                    {
                        var _Tweet = JsonConvert.DeserializeObject<_Tweet>(line);
                        if (_Tweet != null && _Tweet.Text != null)
                        {
                            tweetList.Add(_Tweet);
                        }
                    }
                    catch (Exception e)
                    {
                        lock (errorLock)
                        {
                            using (StreamWriter sw = new StreamWriter("../errors.txt"))
                            {
                                sw.WriteLine("Error reading line: " + e);
                                sw.WriteLine("Line:" + line + " in " + fileName);
                            }
                        }
                    }
                });
            });
            //Wait till the file has been fully processed
            Task.WaitAll(readLines, processLines);

            return tweetList;
        }
    }

    public partial class _Tweet
    {
        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("source")]
        public string Source { get; set; }

        [JsonProperty("in_reply_to_status_id")]
        public object InReplyToStatusId { get; set; }

        [JsonProperty("in_reply_to_user_id")]
        public object InReplyToUserId { get; set; }

        [JsonProperty("in_reply_to_screen_name")]
        public object InReplyToScreenName { get; set; }

        [JsonProperty("user")]
        public User User { get; set; }

        [JsonProperty("geo")]
        public object Geo { get; set; }

        [JsonProperty("coordinates")]
        public object Coordinates { get; set; }

        [JsonProperty("retweet_count")]
        public long RetweetCount { get; set; }

        [JsonProperty("favorite_count")]
        public long FavoriteCount { get; set; }

        [JsonProperty("entities")]
        public Entities Entities { get; set; }

        [JsonProperty("favorited")]
        public bool Favorited { get; set; }

        [JsonProperty("retweeted")]
        public bool Retweeted { get; set; }

        [JsonProperty("lang")]
        public string Lang { get; set; }

        [JsonProperty("timestamp_ms")]
        public string TimestampMs { get; set; }
    }

    public partial class Entities
    {
        [JsonProperty("hashtags")]
        public object[] Hashtags { get; set; }

        [JsonProperty("trends")]
        public object[] Trends { get; set; }

        [JsonProperty("urls")]
        public object[] Urls { get; set; }

        [JsonProperty("user_mentions")]
        public object[] UserMentions { get; set; }

        [JsonProperty("symbols")]
        public object[] Symbols { get; set; }
    }

    public partial class User
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("screen_name")]
        public string ScreenName { get; set; }

        [JsonProperty("verified")]
        public bool Verified { get; set; }

        [JsonProperty("followers_count")]
        public long FollowersCount { get; set; }

        [JsonProperty("friends_count")]
        public long FriendsCount { get; set; }

        [JsonProperty("geo_enabled")]
        public bool GeoEnabled { get; set; }
    }

    public static class Serialize
    {
        public static string ToJson(this _Tweet self) => JsonConvert.SerializeObject(self);
    }

}
