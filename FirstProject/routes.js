const fs = require('fs');

const requestHandler = (req, res) => {


    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write(`<html>
    
        <head>
            <title>
                Nodejs Response
            </title>
        </head>
        
        <body>
            <form action="/message" method="POST">
                <input type="text" name="message">
                <button type="submit">
                    Submit
                </button>
            </form>
        </body>
        
        </html>
    `);
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            fs.writeFile('msg.txt', parsedBody.split('=')[1], (err) => {
                res.writeHead(302, { 'Location': '/' });
                return res.end();
            });

        });

    }

    res.setHeader('Content-Type', 'text/html');
    res.write(`<html>
        <head>
            <title>
                Nodejs Response
            </title>
        </head>
        <body>
            <p>
                Hello There
            </p>
        </body>
    </html>
    `);
    res.end();

}

// module.exports = {
//     started: 'Routes Module started!',
//     requestHandler: requestHandler,
// };
exports.started = 'Routes Module started!';
exports.requestHandler = requestHandler;