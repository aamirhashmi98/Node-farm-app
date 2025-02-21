const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
// const slugify = require("slugify");

////////////////////////////////////////////////////////////////////////////////
// FILE

// Blocking syncronous way:-
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is about Avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written Successfully.");

// Non-Blocking Asyncronous way:-
// console.log("Reading file..");
// fs.readFile("./txt/input.txt", "utf-8", (err, data1) => {
//   console.log(data1);

//   fs.writeFile(
//     "./txt/new.txt",
//     `${data1}.\nCreated on ${Date.now()}`,
//     "utf-8",
//     (err) => {
//       console.log("Your file has been written!");
//     }
//   );
// });

////////////////////////////////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
// console.log(dataObj);

// const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found!</h1>");
  }
  //   console.log(req.url);
});
const portNumber = 3000;
const subAddress = "127.0.0.1";
server.listen(portNumber, subAddress, () => {
  console.log(`Listening to requests on port: ${portNumber}`);
});
