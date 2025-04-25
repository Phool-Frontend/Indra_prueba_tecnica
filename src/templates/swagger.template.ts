const path = require('path');
const fs = require('fs');

const iconPath = path.resolve(__dirname, '..', '..', 'assets', 'icons', 'ico.png');
const imgPath = path.resolve(__dirname, '..', '..', 'assets', 'images', 'swagger.svg');

const icoBase64 = fs.readFileSync(iconPath).toString('base64');
const imgBase64 = fs.readFileSync(imgPath).toString('base64');

export const getSwaggerHtml = (swaggerJson: object) => `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Swagger UI</title>

        <link rel="icon" href="data:image/png;base64,${icoBase64}" type="image/x-icon">
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css">
        
        <style>
            body {
                margin: 0;
                font-family: sans-serif;
            }

            .custom-header {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                background-color: #1b1b1b;
                color: #fff;
            }

            .custom-header img {
                height: 40px;
                margin-right: 15px;
            }

            .custom-header .custom-title {
                font-size: 1.5em;
                font-weight: bold;
            }

            .swagger-ui .topbar {
                display: none;
            }
            /*no Funciona el buscador este es la barra de navegacion*/
        </style>
    </head>
    <body>
    
        <!-- Custom Header -->
        <div class="custom-header">
            <img height="40" src="data:image/svg+xml;base64,${imgBase64}" alt="Swagger UI">
        </div>

        <!-- Swagger UI -->
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function () {
                SwaggerUIBundle({
                    spec: ${JSON.stringify(swaggerJson)},
                    dom_id: '#swagger-ui',
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    layout: "StandaloneLayout",
                    deepLinking: true,
                    filter: false,
                    docExpansion: 'list'
                });
            };
        </script>
    </body>
    </html>
`;