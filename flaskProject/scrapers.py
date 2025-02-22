import requests
from bs4 import BeautifulSoup
import json

base_url = "http://hyperphysics.phy-astr.gsu.edu/hbase/index.html"


def scrape_formulas(url, keywords):
    # Send HTTP request to the URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all table rows
    rows = soup.find_all("tr")

    formulas = []
    for row in rows:
        columns = row.find_all("td")

        # Skip rows with links in <td> elements
        if any(col.find("a") for col in columns):
            continue

        if len(columns) == 2:
            # Extract the formula name and the actual formula
            formula_name = columns[0].get_text(strip=True)
            formula = columns[1].get_text(strip=True)

            # Check if any keyword matches the formula name
            if any(keyword.lower() in formula_name.lower() for keyword in keywords):
                formulas.append({"name": formula_name, "formula": formula})

    return formulas


def scrape_formulas_and_explanations(url, keywords):
    # Send HTTP request to the URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    results = []

    # Find all <h3> elements
    headers = soup.find_all("h3")

    for header in headers:
        # Check if the <h3> text contains any keyword
        header_text = header.get_text(strip=True)
        if any(keyword.lower() in header_text.lower() for keyword in keywords):
            # Find the next <blockquote> sibling
            blockquote = header.find_next_sibling("blockquote")

            if blockquote:
                # Extract the text from the blockquote
                blockquote_text = blockquote.get_text(strip=True, separator="\n")

                results.append({
                    "header": header_text,
                    "content": blockquote_text
                })

    return results


def scrape_links_from_table(url, keywords):
    # Send HTTP request to the URL
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    links = []

    # Find all table rows
    rows = soup.find_all("tr")

    for row in rows:
        columns = row.find_all("td")

        # Check if the row has <a> tags (i.e., it's from the table with links)
        for column in columns:
            link_tag = column.find("a")
            if link_tag:
                link_text = link_tag.get_text(strip=True)
                link_href = link_tag.get("href")

                # Check if any keyword matches the link text
                if any(keyword.lower() in link_text.lower() for keyword in keywords):
                    links.append({
                        "text": link_text,
                        "url": link_href
                    })

    return links
