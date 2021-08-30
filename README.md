# Rentx API - Rent a car!

<img
  src="https://www.pinclipart.com/picdir/big/95-950337_racecar-jake-by-sircinnamon-d5itmuc-adventure-time-car.png"
  style="display: block !important; margin: 0 auto !important;" width="240"
/>


## __Description:__

_This api has two types of users: Admins and regular ones. Admins will be able to use this api to register new cars, categories, specs and images - they will be the user for the Rent A Car brand employee. Regular users are the customers, who will rent a car for a certain period, check available ones, and devolute it._

>Three Main modules make rents prossible:
>
> 1) __Accounts__:
>    
>    Responsible for user creation, authentication, refresh token, password reset, forgot password email sending, user avatar update and to show user profile.
>
> 2) __Cars__:
>
>    Responsible for car registration (creation), , category registration (creation), category importation (multiple category creations through CSV File) specs registration (creation), car specs registration (associating a car with its specs), upload car images (multiple images uploaded for a certain car), delete car image (delete a single image from a certain car), and also list cateogries and specs, list available cars (for renting).
>
>3) __Rents__:
>
>    Responsible to register a rental (creation), to list rental by user and also to confirm a rental devolution.
>
></br>
</br><br>

## __API Reference:__
_You can find proper documentation for this api by running this project:_

1) Clone this repo:
```
git clone https://https://github.com/joao-gabriel-gois/rentx
```

2) Sync up all dependencies:
```
yarn
``` 
2) Set the project:
```
sudo docker-compose up
```

3) Now check API Doc at:

><a src="http://localhost:3333/api-docs">http://localhost:3333/api-docs</a>

<br><br>


## __Tech:__

### Node API using:
* TypeScript;
* Express;
* JWT for Auth;
* TypeORM for Postgres DB;
* Nodemailer to set up email client (TestEnv with Ethereal, prod one with AWS SES);
* Multer for file upload (TestEnv with local disk, prod one with AWS S3);
* TSyringe to manage dependency injection;

<br><br>

## _Next Steps (what still missing?):_
<br>

1) ### Update Doc:
>Need to update all routes to swagger doc

2) ### Missing Tests:

> <br/>
>
>  - __Need to finish tests integration tests for following usecases__:
>
>    - _accounts_:
>
>      - [ ] refreshToken (Not sure why current test is not work, need to review later)
>      - [ ] updateUserAvatar (I'll try later, finish car first)
>
>    - _cars_:
>         - [ ] deleteCarImage
>         - [ ] uploadCarImages
>         - [ ] ImportCategory
>         
><br>