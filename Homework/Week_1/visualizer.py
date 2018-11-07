#!/usr/bin/env python
# Name: wiebe jelsma
# Student number: 12468223
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from statistics import mean

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"

year_2008 = []
year_2009 = []
year_2010 = []
year_2011 = []
year_2012 = []
year_2013 = []
year_2014 = []
year_2015 = []
year_2016 = []
year_2017 = []
year_2018 = []

# open the movies.csv and go through all lines, then get the years from every movie 
with open(INPUT_CSV, "r") as f:
    lines = f.readlines()
    for line in lines:
        stripped_line = line.strip()
        stripped_line = stripped_line.split(",")
        if "(2008)" in stripped_line:
            year_2008.append(stripped_line[1])
        elif "(2009)" in stripped_line:
            year_2009.append(stripped_line[1])
        elif "(2010)" in stripped_line:
            if "Bog" in stripped_line[1]:
                year_2010.append(stripped_line[2])
            else:    
                year_2010.append(stripped_line[1])
        elif "(2011)" in stripped_line:
            year_2011.append(stripped_line[1])
        elif "(2012)" in stripped_line:
            year_2012.append(stripped_line[1])
        elif "(2013)" in stripped_line:
            year_2013.append(stripped_line[1])
        elif "(2014)" in stripped_line:
            if "se" in stripped_line[1]:
                year_2014.append(stripped_line[2])
            else:    
                year_2014.append(stripped_line[1])
        elif "(2015)" in stripped_line:
            year_2015.append(stripped_line[1])
        elif "(2016)" in stripped_line:
            year_2016.append(stripped_line[1])
        elif "(2017)" in stripped_line:
            year_2017.append(stripped_line[1])                                       
# calculate mean for every year  
ave_2008 = mean(float(n) if n else 0 for n in year_2008)
ave_2009 = mean(float(n) if n else 0 for n in year_2009)
ave_2010 = mean(float(n) if n else 0 for n in year_2010)
ave_2011 = mean(float(n) if n else 0 for n in year_2011)
ave_2012 = mean(float(n) if n else 0 for n in year_2012)
ave_2013 = mean(float(n) if n else 0 for n in year_2013)
ave_2014 = mean(float(n) if n else 0 for n in year_2014)
ave_2015 = mean(float(n) if n else 0 for n in year_2015)
ave_2016 = mean(float(n) if n else 0 for n in year_2016)
ave_2017 = mean(float(n) if n else 0 for n in year_2017)


if __name__ == "__main__":
    # plot the plot and print the plot
    plt.plot([2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], [ave_2008, ave_2009, ave_2010, ave_2011, ave_2012, ave_2013, ave_2014, ave_2015, ave_2016, ave_2017], color = "g"
) 
    plt.ylabel("Average rating")
    plt.xlabel("Year")
    plt.axis([2008, 2017, 0, 10])
    plt.title("Overview of average rating per year")
    plt.show()