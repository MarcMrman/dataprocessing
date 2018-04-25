import csv
import json

# local file path, MOET DIT ZO VAN INTERNET AFGEHAALD WORDEN?
csv_file = "./Canadian population 1851-2001.csv"
json_file = "Canadian population 1851-2001.json"

with open(csv_file, "r") as infile:
  reader = csv.DictReader(infile)
  csv_list = list(reader)

# creating and updating dict with data
# data = {}
# data.update(dict(data=csv_list))

# write data into json TERUG IN DICT ZETTEN, NIET ZO HARDCODEN
with open (json_file, 'w') as outfile:
   outfile.write('{"data":')
   json.dump(csv_list, outfile)
   outfile.write('}')