<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Draggable ToDo</title>
    <style>
        *{
            box-sizing: border-box;
        }

        body {
            width: 100%;
            height: 100vh;
            background-color: #101011;
            overflow-x: hidden;
            overflow-y: hidden;
        }

        #root{
            width: 100%;
            height: 100%;
        }
    </style>
    @viteReactRefresh
    @vite("resources/app/main.tsx")
</head>
<body>
    <div id="root"></div>
    <div id="modal-container"></div>
</body>
</html>