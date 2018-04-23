import csv
import json

# local file path, MOET DIT ZO VAN INTERNET AFGEHAALD WORDEN?
csv_file = "./Canadian population 1851-2001.csv"
json_file = "Canadian population 1851-2001.json"

# load csv file into a list
with open(csv_file, "r") as infile:
    reader = csv.DictReader(infile)
    csv_list = list(reader)

print(csv_list)

# creating and updating dict with data
data = {}
data.update(dict(data=csv_list))

# write data into json
with open (json_file, 'w') as outfile:
	json.dump(data, outfile)