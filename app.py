import json

def clean_city_data(input_file, output_file):
    # Load JSON data from the input file with utf-8 encoding
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Extract city names
    city_names = [city['Description'] for city in data if 'Description' in city]
    
    # Save cleaned data to the output file
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(city_names, file, indent=4, ensure_ascii=False)

# File paths
input_file = 'city.json'
output_file = 'cleaned_city_names.json'

# Clean the city data
clean_city_data(input_file, output_file)
