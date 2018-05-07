# Marc Moorman
# 10769781
# Program that writes csv file into json

import csv
import json

#local file paths
gov_expCSV = "./Governmental education expenditure.csv"
gov_expJSON = "Governmental education expenditure.json"
uni_rankCSV = "./World uni ranking.csv"
uni_rankJSON = "World uni ranking.json"

# function to convert a CSV file into JSON
def conversion (infile, outfile):
	
	# open csv file
	with open(infile, "r", encoding="latin-1") as csv_file:
	  reader = csv.DictReader(csv_file)
	  csv_list = list(reader)

	# creating and updating dict with data
	data = {}
	data.update(dict(data=csv_list))

	# write data into json
	with open (outfile, 'w') as json_file:
	   json.dump(data, json_file)	

	return outfile

# call convert function
conversion(gov_expCSV, gov_expJSON)
conversion(uni_rankCSV, uni_rankJSON)