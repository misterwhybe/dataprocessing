# Wiebe Jelsma 12468223
# load a file, change some data and make a json file from it
import pandas as pd
import csv
from bs4 import BeautifulSoup as soup
import matplotlib.pyplot as plt
import json


# load the input file, put in dataframe, drop most columns, delete whitespace
data = pd.read_csv("input.csv")
frame = pd.DataFrame(data)
frame["Region"] = frame["Region"].str.strip()

# get dollars with numbers only, make it a float, make sure to save dataframe
frame["GDP ($ per capita) dollars"] = frame["GDP ($ per capita) dollars"] \
                                            .str.extract('(\d+)')
frame["GDP ($ per capita) dollars"] = frame["GDP ($ per capita) dollars"] \
                                            .astype(float)
frame["GDP ($ per capita) dollars"] = frame["GDP ($ per capita) dollars"] \
                                            .dropna()

# get median, mean, mode and st. deviation
median = frame["GDP ($ per capita) dollars"].median()
mean = frame["GDP ($ per capita) dollars"].mean()
mode = frame["GDP ($ per capita) dollars"].mode()[0]
std = frame["GDP ($ per capita) dollars"].std()
print("median :", median, "mean :", mean, "mode :", mode, \
        "st. deviation :", std)

# get rid of everything that is more that the mean + 3 * st. deviation,
# so outliers will be made NAN
frame["GDP ($ per capita) dollars"].mask(frame["GDP ($ per capita) dollars"] \
                                     > (mean + std * 3), inplace = True)

# plot histogram of GDP
plt.hist(frame["GDP ($ per capita) dollars"])
plt.show()

# now we will work on the infant mortality. make the comma's dots
frame["Infant mortality (per 1000 births)"] = \
    frame["Infant mortality (per 1000 births)"]. \
    replace(",", ".", regex = True)
frame["Infant mortality (per 1000 births)"] = \
    frame["Infant mortality (per 1000 births)"].dropna()

# make everything a float
infant_mortality = frame["Infant mortality (per 1000 births)"]
infant_mortality = infant_mortality.astype(float)

# get Five Summary and put it in a list
FS = infant_mortality.describe()
print(FS)

# plot the boxplot of the infant mortality
infant_mortality.plot.box()
plt.show()

frame = frame.drop(["Area (sq. mi.)", "Population", "Net migration", \
    "Literacy (%)", "Phones (per 1000)", "Arable (%)", "Crops (%)", \
    "Other (%)", "Climate", "Birthrate", "Deathrate", "Agriculture", \
    "Industry", "Service", "Coastline (coast/area ratio)"], axis = 1)

# write the specific dataframe to a json file
frame.set_index("Country").to_json("esa.json", orient = "index")