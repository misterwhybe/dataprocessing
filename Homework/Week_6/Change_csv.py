"""
Wiebe Jelsma (12468223)
Minor programmeren, Data processing
17-12-2018
"""
import pandas as pd 

# def load_csv(self):

data = pd.read_csv("Dataset_students.csv")
data = data[(data["Inequality"] == "Total")]
data = data.drop(["LOCATION", "INDICATOR", "Reference Period", "Flag Codes"\
,"MEASURE", "PowerCode", "Reference Period Code", "Flags", "Unit Code", \
"PowerCode Code", "Measure", "Inequality", "INEQUALITY"], axis = 1)
data = data[(data["Indicator"] == "Household net adjusted disposable income") |\
 (data["Indicator"] =="Years in education") |\
 (data["Indicator"] =="Life expectancy")]

data.to_json("data.json")

# def use_json(self):
#     d3.json("data.json").then(function(data){

