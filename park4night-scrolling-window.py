import json
import requests
import concurrent.futures
import signal
import sys

last = []

try:
		with open("./park4night-result.json", "r") as file:
				last = json.load(file) or []
except FileNotFoundError:
		pass

map = {}

sector = 0

def fetchWindow(lat, lng):
		global sector
		global map
		try:
				response = requests.get(f"https://park4night.com/api/places/around?lat={lat}&lng={lng}&radius=100&lang=en")
				response.raise_for_status()
		except requests.exceptions.RequestException:
				print("Fetch failed! Resuming anyway!")
				return

		json_data = response.json()
		print(f"Fetched sector {sector}/32400. Received {len(list(map.values()))} places.")
		sector += 1

		for place in json_data:
				if place["id"] in map:
						continue
				map[place["id"]] = place

def main():
		global map
		with concurrent.futures.ThreadPoolExecutor(16) as executor:
				futures = []

				for i in range(-60, 75):
						for j in range(-90, 90):
								future = executor.submit(fetchWindow, f"{i}.0000000", f"{j}.0000000")
								futures.append(future)

				# Wait for all futures to complete
				concurrent.futures.wait(futures)

		with open("./park4night-result.json", "w") as file:
				json.dump(list(map.values()), file)
		print("Parallel execution complete!")

def signalHandler(sig, frame):
	global map
	with open("./park4night-result.json", "w") as file:
		json.dump(list(map.values()), file)
	sys.exit(0)

if __name__ == "__main__":
	main()
	signal.signal(signal.SIGINT, signalHandler)
	signal.pause()