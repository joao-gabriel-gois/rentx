# Rentx - Your api to help your clients to rent a car!

<img
  src="https://www.pinclipart.com/picdir/big/95-950337_racecar-jake-by-sircinnamon-d5itmuc-adventure-time-car.png"
  style="display: block; margin: 0 auto;" width="240"
/>

## Reviewing Tests:

> <br/>
>
> - __Need to finish unit tests for usecases__:
>      - _accounts_:
>        - [X] refreshToken
>        - [x] updateUserAvatar
>      - _cars_:
>        - [x] deleteCarImage
>        - [x] uploadCarImages
>        - [x] importCategory
>      - _rents_:
>        - [x] rentalDevolution
>
> <br/>
>
>  - __Need to finish integration tests for usecases__:
>    - _accounts_:
>
>      - [x] authenticateUser
>      - [x] createUser
>      - [ ] refreshToken (Not sure why current test is not work, need to review later)
>      - [ ] updateUserAvatar (I'll try later, finish car first)
>
> <br/>
>
>    - _cars_:
>
>      - [x] createCar
>      - [x] createCategory
>      - [x] createSpecifications
>      - [x] listCategories
>      - [x] listSpecifications
>      - [x] listAvailableCars
>      - [x] createCarSpecification
>      - Still some missing ones need review, have file upload, they are:
>         - [ ] deleteCarImage
>         - [ ] uploadCarImages
>         - [ ] ImportCategory
>         - __Next Refactoring must review all tests and correct above ones__
>
> <br/>
>
>    - _rents_:
>
>      - [x] createRental
>      - [x] listRentalByUser
>      - [x] rentalDevolution
>
> <br/>