To start service locally we need different things :-
1. Add .env file values
2. Run command :- npm run start

ALL API's Curl ( I have created different kind of API's based on the story )

curl --location 'http://localhost:3000/api/insertData' \
--header 'Content-Type: application/json' \
--data '{
    "customer_name": "Customer 35",
    "product": "Women Jewellery 227",
    "product_category": "Women Fashion",
    "sales_price": 3512.34,
    "sales_units": 22,
    "sales_revenue": 77271.48000000001,
    "cost_of_sales": 61817.21,
    "profit_or_loss": "Profit",
    "geography": "North West",
    "country": "Norway",
    "year": 2020,
    "quarter": "Q3",
    "month": "July"
}'


curl --location 'http://localhost:3000/api/testapi'


curl --location 'http://localhost:3000/api/reteriveSalesData?customer_name=Customer%2035&country=Denmark'

curl --location 'http://localhost:3000/api/getAggreagateComb' \
--header 'Content-Type: application/json' \
--data '{
    "dimensions": [
        "product",
        "country"
    ],
    "measures": [
        "sales_units",
        
        "profit_or_loss",
        "cost_of_sales"

    ]
}'


*****  NOTE -  Couple of more API's i have integrated in service , i am not attaching their curl here, but please have a look on it also.