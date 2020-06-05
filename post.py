import requests

url = 'http://localhost/get.php'
myobj = {"key": "Hello there"}

x = requests.post(url, params=myobj)
