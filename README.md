<h1 align="center">
  Local Library - React
</h1>

<p align="center">
This project is an extension of a previous version of a tutorial from <a href='https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website'>Developer Mozilla</a> to build a Local Library using <a href='http://expressjs.com/'>Express JS</a>.
</p>

<p align="center">
This application was developed using <a href='https://reactjs.org/'>React</a> as frontend, but also you can check this application implemented using Pug template <a href='https://github.com/LorranSutter/Local-library'>here</a>.
</p>

<p align="center">
    <a href='#straight_ruler-Development-pipeline-and-challenges'>Development and challenges</a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="#runner-how-to-run">How to run</a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="#book-Resources">Resources</a>&nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="#computer-Technologies">Technologies</a>
</p>
 
<div align="center">

<img src="https://res.cloudinary.com/lorransutter/image/upload/v1591732356/Local_library_react_preview.gif" alt="Preview Chat" height=200/>

</div>

## :straight_ruler: Development pipeline and challenges

This project is an extension from this [another project](<(https://github.com/LorranSutter/Local-library)>) implemented using Pug. You may check the whole development pipeline there if you want. Here I will just talk about the differences and new challenges.

1. As mentioned above, this project is an extension of a previous version. I have decided to extend this version so as to I could learn more about [ReactJS](https://reactjs.org/). For such, I should start turning my Pug template into a API.

2. Initially, I started this project to learn more about ReactJS. However, I realized that it was the opportunity to improve another skill: **testing**.

3. Before moving to frontend development with React, I set out to build test cases to my API. I chose to use [Jest](https://jestjs.io/) as my testing framework, due to its simplicity and because I had already have some contact with this tool.

   In the meanwhile, I got confused with integrating properly my API with Jest using mongo as database. I found this blog [Endpoint testing](https://zellwk.com/blog/endpoint-testing/) as a valuable source to help me on this path.

4. We have lots of great system designs provided by companies so as to developers can create apps based on the interfaces of these companies. I have decided to use [Polaris](https://polaris.shopify.com/) from Shopify to develop this interface.

   Polaris is a great system design with a extensive documentation of how and where to use colors, shapes, icons, spacing and so on. Also, it provides a great library of react components, which makes really easy to develop your own interface.

## :runner: How to run

Open your terminal in the folder you want to clone the project

```sh
# Clone this repo
git clone https://github.com/LorranSutter/Local-library-React.git

# Go to the project folder
cd Local-library-React

# Go to each folder and install dependencies
cd backend
npm install

cd ../frontend
npm install
```

Now you will need two opened terminals to run the project. One for the backend and another one for the frontend.

Backend will run on http://localhost:5000/

Frontend will run on http://localhost:3000/

```sh
# Go to backend
cd backend

# Run the project
npm start

## In the another terminal ##

# Go to frontend
cd frontend

# Run the project
npm start
```

If you want to use your own mongodb account, replace the following variable with your own mongo URL:

```sh
# Go to backend/connectionDB.js
MONGOURI = <your-url>
```

Then you may populate your database using the following command:

```sh
cd backend

# Go to populate.js and change the mongo url as well
MONGOURI = <your-url>

# Run script
node populatedb.js
```
## :book: Resources

- [Developer Mozilla](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website) - tutorial to build local library
- [Endpoint testing](https://zellwk.com/blog/endpoint-testing/) - article about testing

## :computer: Technologies

- [Polaris](https://polaris.shopify.com/) - design system
- [Express](http://expressjs.com/) - web application framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Async](https://caolan.github.io/async/v3/) - library to perform asynchronous operations
- [Express validator](https://express-validator.github.io/docs/) - middleware to validate data
- [ReactJS](https://reactjs.org/) - frontend library
- [Axios](https://www.npmjs.com/package/axios) - HTTP requests
- [Jest](https://jestjs.io/) - library for tests
