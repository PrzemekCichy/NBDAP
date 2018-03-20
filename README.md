# Twitter-Data-Analysis-Platform #

This application aims to assist and simplyfy the following processes for the users:
* Data Management
* Data Preparation
* Data Analysis

## Data Management ##
The data gathereing is simplified so that programming knowledge is not required. All options output text/json files, with each tweet at one line.

There are two options availible, saving stream data directly using twitter API or transforming data from archive files, eg. https://archive.org/details/twitterstream

### Archive Data ###
At the moment the application only allows Decompressed (.json) files to be scanned. There is a utility which allows to decompress and minify bz2 archives. To save space, most but the crucial data is stripped, resulting in only 2x increase per file, but much greater speed improvement when carrying on searches later on.

### Stream ###
Stream is limited to return up to 1% of the total tweets posted on Twitter. By putting a keyword, Filtered Stream is created, which allows all tweets matching the criteria to be returned up to the 1% threshold, meaning if the search is too wide, the the Stream API will not return all the tweets.


## Data Preparation ##
Once data is gathered, it can be filtered to output only tweets matching the requested keywords.
At the time of writing, you have to run the search before the data can be analysed. This is a drawback for certain types, however I will add improvements in the future. Currently, only text is implemented, but it will be reasonably quick to add more types in the future, such as hashtags, users, or geo-localization.

The search uses Aho-Corasick algorithm, so it can contain multiple keywords and perform very fast irregardles on the number of keywords. 

## Data Analysis ##
Once data is gathered, sentiment analysis can be performed on the data set. Then, data  


## Installation ##

Make sure you have .Net Core environment set up on the machine.
Next, download the release and run the following in the command line:

cd <path to your WebApp.dll>  
dotnet webapplication.dll

This will start the server.

##Help##
There is a help section in the application. Some functionality might be quite quirky as the methods might be very strict in the type of expected input, however I hope to polish it up at some point.
