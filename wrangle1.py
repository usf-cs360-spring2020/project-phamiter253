from csv import writer
from csv import reader
 

def first_genre(input):
	results = []
	results.append("first_genre")
	with open(input) as csvfile:
	    reader = csv.reader(csvfile) # change contents to floats
	    for row in reader: # each row is a list
	        results.append(row[3][0])

	return results

def add_column_in_csv(input_file, output_file, transform_row):
    """ Append a column in existing csv using csv.reader / csv.writer classes"""
    # Open the input_file in read mode and output_file in write mode
    with open(input_file, 'r') as read_obj, \
            open(output_file, 'w', newline='') as write_obj:
        # Create a csv.reader object from the input file object
        csv_reader = reader(read_obj)
        # Create a csv.writer object from the output file object
        csv_writer = writer(write_obj)
        # Read each row of the input csv file as list
        for row in csv_reader:
            # Pass the list / row in the transform function to add column text for this row
            transform_row(row, csv_reader.line_num)
            # Write the updated row / list to the output file
            csv_writer.writerow(row)


onegenre = first_genre("animes.csv")
print str(onegenre)[1:-1]