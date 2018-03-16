using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Playground
{
    class Program
    {
        static void Main(string[] args)
        {
            MergeSearchResults(@"F:\Test", "output");

            //Generate stats

            //Read file

            //Deserialize tweets

            //Count occurrences of search terms 
            using (StreamReader stream = File.OpenText(@"F:\Test\output.txt"))
            {
                JsonSerializer se = new JsonSerializer();
                object parsedData = se.Deserialize(stream, typeof(Object));
            }

        }

        //This method wont be usefull since 
        public static void MergeSearchResults(string path, string outputName) {

            var files = Directory.GetFiles(path, "*.txt", SearchOption.AllDirectories).Where(item => item.ToLower().Contains("matched"));

            //Go through directory and get files
            //Concatinate the files
            using (var output = File.Create(path + "/" +outputName + ".txt"))
            {
                foreach (var file in files)
                {
                    using (var input = File.OpenRead(file))
                    {
                        input.CopyTo(output);
                    }
                }
            }
        }
    }
}
