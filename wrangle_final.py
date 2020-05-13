import json
import pandas as pd
import numpy as np
from csv import writer
from csv import reader
import re
import csv
from collections import defaultdict


def ctree():
	""" One of the python gems. Making possible to have dynamic tree structure.

	"""
	return defaultdict(ctree)


def build_leaf(name, leaf):
	""" Recursive function to build desired custom tree structure

	"""
	res = {"name": name}

	# add children node if the leaf actually has any children
	if len(leaf.keys()) > 0:
		res["children"] = [build_leaf(k, v) for k, v in leaf.items()]

	return res


def main():
	""" The main thread composed from two parts.

	First it's parsing the csv file and builds a tree hierarchy from it.
	Second it's recursively iterating over the tree and building custom
	json-like structure (via dict).

	And the last part is just printing the result.

	"""
	tree = ctree()
	# NOTE: you need to have test.csv file as neighbor to this file
	with open('animes_with_years_and_genres.csv', encoding="utf8") as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:

			# skipping first header row. remove this logic if your csv is
			# headerless
			if len(row) == 0:
				continue

			if row[12] == 'first_genre':
				continue
			# usage of python magic to construct dynamic tree structure and
			# basically grouping csv values under their parents
			


			leaf = tree[row[11]]
			leaf = leaf[row[12]]
			leaf = leaf[row[3]]
			leaf = leaf[row[1]]
						

	# building a custom tree structure
	res = []
	for name, leaf in tree.items():
		res.append(build_leaf(name, leaf))

	json_string = json.dumps(res, indent=1)
	fp = open('sun7.json', 'w', encoding="utf8")
	print(json_string, file=fp)
	fp.close()
	# json_string = json.dumps(res, indent=1)
	# fp = open('sun.json', 'w', encoding="utf8")
	# print(json_string, file=fp)
	# fp.close()


# so let's roll
main()


# tree = dict()
# genres = set()
# genreChildren = []
# main_genre = dict()

# genres = dict()

# tree["name"] = "Genres"

# with open('animes_with_years_and_genres.csv', 'r', encoding="utf8") as inputFile:
# 	#data = csv.load(inputFile)
# 	csv_reader = reader(inputFile, skipinitialspace=True)
# 	#print(reader)



# print(tree)

# Opening JSON file and loading the data 
# into the variable data 
# with open('stacked-bar1.json') as json_file: 
#     data = json.load(json_file) 
  
# #employee_data = data['emp_details']

# #print(data); 


# # # now we will open a file for writing 
# data_file = open('data_file2.csv', 'w') 
  
# # # create the csv writer object 
# csv_writer = writer(data_file) 
  
# # # Counter variable used for writing  
# # # headers to the CSV file 
# # count = 0

# header = ["year, high_count", "low_count", "highest_rated", "lowest_rated"] 
# csv_writer.writerow(header)

# for e in data:
# 	row = [e['year'], e['data']['high_count'], e['data']['low_count'], e['data']['highest_rated'][0], e['data']['lowest_rated'][0]]
# 	#print(row)
# 	csv_writer.writerow(row) 
  
# for emp in employee_data: 
#     if count == 0: 
  
#         # Writing headers of CSV file 
#         header = ["year, high_count", "low_count", "highest_rated", "lowest_rated"] 
#         csv_writer.writerow(header) 
#         count += 1
  
#     # Writing data of CSV file 
#     csv_writer.writerow(emp.values()) 
  
#inputFile.close() 

# with open('C:\\Users\\cilla\\final_raw_files\\animes.csv', 'r', encoding="utf8") as fin, open('final_animes_1986-2019.csv', 'w', newline='', encoding="utf8") as fout:

# 	# define reader and writer objects
# 	csv_reader = reader(fin, skipinitialspace=True)
# 	csv_writer = writer(fout, delimiter=',')

# 	# write headers
# 	csv_writer.writerow(next(csv_reader))

# 	# iterate and write rows based on condition
# 	for i in csv_reader:
		
# 		if i[4] != '':
# 			str = re.search(r'\d{4}', i[4])
# 			if str and int(str.group()) >= 1986 and int(str.group()) <=2019:
# 				#print(str.group())
# 				if "Hentai" not in i[3]:
# 					#print(i[3])
# 					if i[-3] != "":
# 						#print(i[1] + " " + i[-3] + " " + i[4])
# 						if i[-4] != "":
# 							#print(i[1] + " " + i[-4])
# 							if i[-5] != "":
# 								csv_writer.writerow(i)
	

# f = pd.read_csv("C:\\Users\\cilla\\final_animes_1986-2019.csv")
# keep_col = ['uid','title','synopsis','genre','aired','episodes','members','popularity','ranked','score','img_url']
# new_f = f[keep_col]
# new_f.to_csv("removed_links_animes_1986-2019.csv", index=False)

# rows = reader(open("removed_links_animes_1986-2019.csv", "r", encoding="utf8"))
# newrows = []
# for row in rows:
# 	if row not in newrows:
# 		newrows.append(row)
# csv_writer = writer(open("removed_links_animes_1986-2019_nodups.csv", "w", newline='', encoding="utf8"))
# csv_writer.writerows(newrows)

# animes = set()

# with open('C:\\Users\\cilla\\removed_links_animes_1986-2019.csv', 'r', encoding="utf8") as csvfile:
# 	csv = reader(csvfile) # change contents to floats
# 	for i in csv: # each row is a list
# 		animes.add(i[0])

# with open('C:\\Users\\cilla\\final_raw_files\\reviews.csv', 'r', encoding="utf8") as fin, open('reviews_removed_links_1986-2019.csv', 'w', newline='', encoding="utf8") as fout:

# 	# define reader and writer objects
# 	csv_reader = reader(fin, skipinitialspace=True)
# 	csv_writer = writer(fout, delimiter=',')

# 	# write headers
# 	csv_writer.writerow(next(csv_reader))

# 	# iterate and write rows based on condition
# 	for i in csv_reader:
# 		#print(i[-13])
# 		if i[2] in animes:
# 			csv_writer.writerow(i)


# f = pd.read_csv("C:\\Users\\cilla\\reviews_removed_links_1986-2019.csv")
# keep_col = ['uid','anime_uid','scores']
# new_f = f[keep_col]
# new_f.to_csv("reviews_animeSet_keep_uid_animeUid_scores_1986-2019.csv", index=False)

# rows = reader(open("reviews_animeSet_keep_uid_animeUid_scores_1986-2019.csv", "r", encoding="utf8"))
# newrows = []
# for row in rows:
# 	if row[0] not in newrows:
# 		#print(row)
# 		newrows.append(row)
# csv_writer = writer(open("reviews_animeSet_keep_uid_animeUid_scores_1986-2019_nodups.csv", "w", newline='', encoding="utf8"))
# csv_writer.writerows(newrows)


# with open('C:\\Users\\cilla\\reviews_animeSet_keep_animeUid_scores_1986-2019.csv', 'r', encoding="utf8") as fin:

# 	csv_reader = reader(fin, skipinitialspace=True)

# 	for i in csv_reader:
# 		str = re.findall(r'\d+', i[1])
# 		print(str)


# animes = dict()

# with open('C:\\Users\\cilla\\removed_links_animes_1986-2019.csv', 'r', encoding="utf8") as csvfile:
# 	csv = reader(csvfile) # change contents to floats
# 	for i in csv: # each row is a list
# 		animes[i[0]] = ""


# with open('C:\\Users\\cilla\\reviews_animeSet_keep_uid_animeUid_scores_1986-2019.csv', 'r', encoding="utf8") as fin:

# 	# define reader and writer objects
# 	csv_reader = reader(fin, skipinitialspace=True)
	
# 	unique_reviews = set()
# 	# iterate and write rows based on condition
# 	for i in csv_reader:
# 		#print(i[-13])
# 		if i[1] in animes and i[0] not in unique_reviews:
# 			unique_reviews.add(i[0])
# 			animes[i[1]] = animes[i[1]] + ";"+ i[2]

# animeavg = dict()
# for anime in animes:
# 	scoreObject = animes[anime].split(";")
# 	#print(len(scoreObject))
# 	count = 0
# 	story = 0
# 	animation = 0
# 	sound = 0
# 	character = 0
# 	enjoyment = 0
# 	for s in scoreObject:
# 		#print(s)
# 		#total += int(s)
# 		nums = re.findall(r'\d+', s)
# 		if nums != []:
# 			count += 1
# 			story += int(nums[1])
# 			animation += int(nums[2])
# 			sound += int(nums[3])
# 			character += int(nums[4])
# 			enjoyment += int(nums[5])
# 			#print(nums[0])
# 	if len(scoreObject) > 1:
# 		#print(len(scoreObject))
# 		animeavg[anime] = {"Story": story/len(scoreObject)-1, "Animation": animation/len(scoreObject)-1, "Sound": sound/len(scoreObject)-1, "Character": character/len(scoreObject)-1, "Enjoyment": enjoyment/len(scoreObject)-1, "Total_Reviews": len(scoreObject)-1}
# 	#animes[anime] = "Average: " + str(total/len(st)) + " Number of Review: " + str(len(st))
# 	#print(anime)
# json_string = json.dumps([{'uid': k, 'averages': v} for k,v in animeavg.items()], indent=2)
# #print(json_string)

# fp = open('results5.json', 'w')
# print(json_string, file=fp)
# fp.close()
	#json.dump([{'uid': k, 'averages': v} for k,v in animeavg.items()], fp)

# resultsYears = []
# #animes = []
# with open('removed_links_animes_1986-2019_nodups.csv', encoding="utf8") as csvfile:
#   csv = reader(csvfile) # change contents to floats
#   for row in csv: # each row is a list
#     year = re.search(r"\d{4}",row[4])
#     if year:
#       resultsYears.append(year.group())
#     else:
#       resultsYears.append(0)
# #return resultsYears

# resultsGenre = []
# with open('removed_links_animes_1986-2019_nodups.csv', encoding="utf8") as csvfile:
# 	csv = reader(csvfile) # change contents to floats
# 	for row in csv: # each row is a list
# 		#print(row)
# 		genre = re.search(r"[a-zA-Z, ,-]+",row[3])
# 		if genre:
# 		  resultsGenre.append(genre.group())
# 		else:
# 		  resultsGenre.append('first_genre')

# def add_column_in_csv(input_file, output_file, column1,column2):
# 	""" Append a column in existing csv using csv.reader / csv.writer classes"""
# 	# Open the input_file in read mode and output_file in write mode
# 	count = 0
# 	with open(input_file, 'r', encoding="utf8") as read_obj, \
# 	    open(output_file, 'w', encoding="utf8") as write_obj:
# 	  # Create a csv.reader object from the input file object
# 	  csv_reader = reader(read_obj)
# 	  # Create a csv.writer object from the output file object
# 	  csv_writer = writer(write_obj)
# 	  # Read each row of the input csv file as list
# 	  for row in csv_reader:
# 	    # Pass the list / row in the transform function to add column text for this row
# 	    row.append(column1[count])
# 	    row.append(column2[count])

# 	    count += 1
# 	    # Write the updated row / list to the output file
# 	    csv_writer.writerow(row)


# add_column_in_csv('removed_links_animes_1986-2019_nodups.csv', 'animes_with_years_and_genres.csv', resultsYears, resultsGenre)


# df = pd.read_csv('animes_with_years_and_genres.csv')

# ## mean = 6.426856458590852
# mean = df['score'].mean()
# print(mean)
animesData = dict()
stack = dict()
years = set()


with open('removed_links_animes_1986-2019_nodups.csv', 'r', encoding="utf8") as fin:

	csv_reader = reader(fin, skipinitialspace=True)

	for row in csv_reader:
		animesData[row[0]] = row
		year = re.search(r"\d{4}",row[4])
		if year:
			years.add(year.group())


df = pd.read_csv('animes_with_years_and_genres.csv')
#pivot = df.pivot_table(index=['year'], values=['score'], aggfunc={max, min})
#print(pivot)


count = df.groupby(['year'])
#high_count = df.loc[df.groupby(['year'], sort=True)['score'].idxmax()]
#low_count = df.loc[df.groupby(['year'], sort=True)['score'].idxmin()]
for year,group in count:
	
	max_count = sum(1 for x in group.score if float(x) >= 6.43)
	low_count = sum(1 for x in group.score if float(x) < 6.43)
	highest = df.loc[group.score.idxmax(),'uid']
	lowest = df.loc[group.score.idxmin(), 'uid']
	stack[year] = {"high_count": max_count, "low_count": low_count, "highest_rated": animesData[str(highest)], "lowest_rated": animesData[str(lowest)]}
	# print(len(group)-1)

# for y in stack:
# 	print(stack[y])
# #index = df.iloc[df.score.argmax(), 0:2]

#print(high_count)
json_string = json.dumps([{'year': k, 'data': v} for k,v in stack.items()], indent=2)
#print(json_string)

fp = open('stacked-bar1.json', 'w')
print(json_string, file=fp)
fp.close()