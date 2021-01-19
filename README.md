# Secret Auction UI

## Set up

Run `yarn` to install the dependencies

````bash
yarn
````

## Run development

Copy .env.testnet example to .env then run the app using the script provided

````bash
cp .env.testnet .env
yarn run develop
````


Conversation points

- What pagination tools are required-possible?
- Closed auctions have pagination active don't
- The role of the label, hide it from the user, emoji, identicon
- Application specific viewing keys
- Transaction management
- Limit the number of emoji so they won't change after release
- Decrease allowance takes SCRT