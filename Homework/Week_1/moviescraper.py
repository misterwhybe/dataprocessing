#!/usr/bin/env python
# Name: wiebe jelsma
# Student number: 12468223
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # create a list for all fields
    Title = []
    Rating = []
    Year = []
    Actors = []
    Runtime = []
    # get list of title of movies
    def Titles():
        for titles in dom.find_all("h3"):
            for new_title in titles.find_all("a"):
                movie_title = new_title.contents[0]
                Title.append(movie_title)
        return Title

    # get list of rating of movies
    def Ratings():
        for ratingz in dom.find_all("span", "value"):
            movie_rating = ratingz.contents[0]
            movie_rating = float(movie_rating)
            Rating.append(movie_rating)
        return Rating

    # get list of the years the movie are released
    def Years():
        for years in dom.find_all("span", class_ ="lister-item-year text-muted unbold"):
            year = years.contents[0]
            Year.append(year[-5:-1])
        return Year

    # get list of all actors per movie, this one is difficult! 
    for actors in dom.find_all("div", class_="lister-item-content"):
        Actorz = []
        for all_actor in actors.find_all("a"):
            if "_st" in all_actor.get("href"):
                Actorz.append(all_actor.get_text())  
        Actors.append(Actorz)  
    

        # get list of amount of minutes a movie is
        for time in actors.find_all("span", class_= "runtime"):
            runtime = time.contents[0]
            Runtime.append(runtime)
            Runtime = [s.replace(' min', '') for s in Runtime]
       
    Titles()
    Ratings()
    Years()
    return(Title, Rating, Year, Actors, Runtime)   # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    
    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK
    # get all the lists back
    title = movies[0]
    rating = movies[1]
    year = movies[2]
    actors = movies[3]
    runtime = movies[4]
    
    # write the rows in an csv file
    for row in range(50):
        writer.writerow([title[row], rating[row], year[row], actors[row], runtime[row]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)