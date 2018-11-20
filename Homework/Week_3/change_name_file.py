# Wiebe Jelsma 12468223
# this file will change a csv file and return a json file

import pandas as pd 
import json

data = pd.read_csv("data.csv")
data.to_json("data.json")
