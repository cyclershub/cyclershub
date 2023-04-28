import requests
import time
import concurrent.futures
import json
import os


img_urls = []
with open('./park4night-result.json', 'r') as url_list:
	json_file = json.loads(url_list.read())
	for place in json_file:
		if len(place["images"]) > 0:
			i = 0
			for image in place["images"]:
				img_urls.append([place["id"], image["url"], i])
				i += 1

downloaded = 0

def download_image(arr):
	global downloaded
	id, url, i = arr
	img_name = f'./downloads/{id}_{i}.jpg'
	if os.path.isfile(img_name):
		print(f'{img_name} already downloaded, skipping... {downloaded}/{len(img_urls)} done!')
		downloaded += 1
		return
	img_bytes = requests.get(url).content
	with open(img_name, 'wb') as img_file:
		img_file.write(img_bytes)
		print(f'{img_name} was downloaded... {downloaded}/{len(img_urls)} done!')
		downloaded += 1

t1 = time.perf_counter()

with concurrent.futures.ThreadPoolExecutor(16) as executor:
	for url in img_urls:
		executor.submit(download_image, url)

t2 = time.perf_counter()

print(f'Finished in {t2-t1} seconds')