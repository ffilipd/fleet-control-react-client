#!/bin/bash

############################################
# This script generates translation files  #
# and presets the value to the key.        #
# If the values are already defined, they  #
# will be omitted.                         #
############################################


# Check if the i18next module is installed
if ! npm list -g i18next > /dev/null 2>&1; then
  echo "i18next module is not installed. Installing it..."
  npm install -g i18next
fi

# run the translation file generator
i18next

# Directory where the translation files are located
translationDirectory="./src/locales/"

# Check if the directory exists
if [ ! -d "$translationDirectory" ]; then
  echo "Directory '$translationDirectory' does not exist."
  exit 1
fi

# Find all JSON files within the directory and its subdirectories
translation_files=$(find "$translationDirectory" -type f -name "*.json")

# Loop through the JSON files and modify them
for translation_file in $translation_files; do
  # Use jq to modify the JSON file
  jq 'to_entries | map(if .value == "" then .value = .key else . end) | from_entries' "$translation_file" > tmp.json

  # Rename the temporary file back to the original file
  mv tmp.json "$translation_file"

  echo "File '$translation_file' updated."
done

echo "Translation files have been updated and empty values are preset with the key as default value!"
