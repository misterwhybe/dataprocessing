# Wiebe Jelsma 12468223
import pandas as pd 

data = pd.read_csv("data.csv")
frame = pd.DataFrame(data)
frame["Value"] = frame["Value"].dropna()
frame = frame[frame.MEASURE == "KTOE"]
frame = frame[frame.LOCATION == "AUS"]
frame = frame.drop(["INDICATOR", "SUBJECT", "MEASURE", \
        "FREQUENCY", "Flag Codes", "LOCATION"], axis = 1)
frame.to_json("data.json")