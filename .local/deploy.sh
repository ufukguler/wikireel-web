#!/bin/bash

# Check if required environment variables are set
if [ -z "$WIKIREEL_FTP_HOST" ] || [ -z "$WIKIREEL_FTP_USER" ] || [ -z "$WIKIREEL_FTP_PASSWORD" ]; then
    echo "Error: WIKIREEL_FTP_HOST, WIKIREEL_FTP_USER, and WIKIREEL_FTP_PASSWORD environment variables must be set"
    exit 1
fi

# Run the Python deployment script
python3 .deploy/deploy.py \
    --host "$WIKIREEL_FTP_HOST" \
    --username "$WIKIREEL_FTP_USER" \
    --password "$WIKIREEL_FTP_PASSWORD" \
    --local-dir "." \
    --remote-dir "/public_html"