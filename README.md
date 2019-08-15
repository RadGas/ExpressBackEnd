# ExpressBackEnd

Back End Service for Application

# Coordinates :

#### Get gas stations near coordinate & Gas type 1

Host : /assets-v2/api/stations?lat=25.8925211&lng=-80.3352364&fuel=1

Ours : http://localhost:3000/api/coordinates?lat=25.8925211&lng=-80.3352364&fuel=1

#### Get gas stations near coordinate & advanced search

Host : /assets-v2/api/stations?lat=25.8925211&lng=-80.3352364&fuel=1&brandId=14&maxAge=8

Ours : http://localhost:3000/api/coordinates?lat=25.8925211&lng=-80.3352364&fuel=1&brandId=14&maxAge=8

#### Get gas trends near coordinates

Host : /assets-v2/api/trends?lat=25.8925211&lng=-80.3352364

Ours : http://localhost:3000/api/trends?lat=25.8925211&lng=-80.3352364

# ZipCode :

#### Get gas stations at zipcode with advanced search

Host : assets-v2/api/stations?search=33018&fuel=1&brandId=14&maxAge=8

Ours : http://localhost:3000/api/zipcode/33018?fuel=1&brandId=14&maxAge=8

#### Get trends at zipcode

Host : assets-v2/api/trends?search=33018

Ours : http://localhost:3000/api/trends/33018

# TODO Havent Figured out && Maybe not needed :

#### COORDINATES

https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52090&stationIds=52091&stationIds=149725&stationIds=123210&stationIds=52098&stationIds=150088&stationIds=95618&stationIds=52092&stationIds=137383&stationIds=149223

https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=52103&stationIds=52110&stationIds=197688&stationIds=52079&stationIds=196517&stationIds=138906&stationIds=52371&stationIds=171296&stationIds=194100&stationIds=33932&stationIds=192114&stationIds=45942&stationIds=52490&stationIds=52404&stationIds=52491&stationIds=199140&stationIds=108296&stationIds=52313&stationIds=159703&stationIds=38627&stationIds=52399&stationIds=52268&stationIds=144044&stationIds=146299&stationIds=75630

https://www.gasbuddy.com/assets-v2/api/stations?lat=25.8925211&lng=-80.3352364&fuel=1&brandId=14&maxAge=8&cursor=25

https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=27601&stationIds=40391&stationIds=52117&stationIds=52587&stationIds=51900&stationIds=45713&stationIds=52634&stationIds=37262&stationIds=52631&stationIds=85728&stationIds=52130&stationIds=52172&stationIds=110459&stationIds=51961&stationIds=52111&stationIds=31672&stationIds=52168&stationIds=51936

####ZipCode:

https://www.gasbuddy.com/assets-v2/api/fuels?stationIds=113088&stationIds=153012&stationIds=148139&stationIds=138342&stationIds=172377&stationIds=52361&stationIds=88084&stationIds=148142&stationIds=105650&stationIds=151568&stationIds=71241&stationIds=95777
