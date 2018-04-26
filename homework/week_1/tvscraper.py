#!/usr/bin/env python
# Name: Marc Moorman   
# Student number: 10769781
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # initialize lists
    TV_SERIES = []
    titles = []
    ratings = []
    genres = []
    stars = []
    runtime = []

    # retrieve all needed data from imdb.com
    data = dom.find_all('div', 'lister-item-content')

    # add needed info to lists
    for series in data:
        titles.append(series.find('a', href=lambda href: href and '?ref_=adv_li_tt' in href).contents[0])
        ratings.append(series.find('strong').contents[0])
        genres.append(series.find('span', 'genre').contents[0].strip())
        
        actorList = []        
        
        # retrieving actors per series
        a = series.find_all('a', href=lambda href: href and '?ref_=adv_li_st' in href)
        
        # filtering out html tags from list of actors and join them into a list
        for actors in a:
            actor = actors.text  
            actorList.append(actor)
            actorList1 = ",".join(actorList)
        stars.append(actorList1)    

        runtime.append(series.find('span', 'runtime').contents[0].strip("min"))
    
    # append all info to list to be returned
    TV_SERIES.append(titles)
    TV_SERIES.append(ratings)
    TV_SERIES.append(genres)
    TV_SERIES.append(stars)
    TV_SERIES.append(runtime)

    return TV_SERIES


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write csv file one element per list
    for elements in range(50):
        writer.writerow((tvseries[0][elements], tvseries[1][elements], tvseries[2][elements], 
            tvseries[3][elements], tvseries[4][elements]))

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

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
