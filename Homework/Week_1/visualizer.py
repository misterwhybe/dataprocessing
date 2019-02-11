#!/usr/bin/env python
# Name: wiebe jelsma
# Student number: 12468223
"""
This script visualizes data obtained from a .csv file
"""
def visualize():
    import csv
    import matplotlib.pyplot as plt
    from statistics import mean

    INPUT_CSV = "movies.csv"
    START = 2008
    END = 2018

    # dictionary for the data
    data_dict = {str(key): [] for key in range(START, END)}

    with open(INPUT_CSV, 'r') as csv_file:
        reader = csv.reader(csv_file, delimiter=',')
        next(reader)
        for row in reader:
            data_dict[row[2]].append(float(row[1]))
           
    # calculate average rating per year
    def average(data_dict):
        average_rating=[]
        for ratings in list(data_dict.values()):
            average_rating.append(round(sum(ratings)/len(ratings),1))
        linechart(average_rating)

    # make line chart with averages per year
    def linechart(average_rating):
        plt.plot(list(data_dict),average_rating)
        plt.title('Average rating per year')
        plt.ylabel('IMDb rating')
        plt.xlabel('Year')
        plt.show()

    average(data_dict)
if __name__ == "__main__":
    visualize()