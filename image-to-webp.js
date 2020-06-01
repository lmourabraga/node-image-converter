const fs = require('fs');
const webp = require('webp-converter'); //Read more: https://www.npmjs.com/package/webp-converter#how-to-use

//Selects the folder 'image-to-convert' and put each file name + extension inside of it into an array we will call images
fs.readdir('images-to-convert', function (error, images) {

    //forEach loop will go thought each image to convert
    images.forEach((image, index) => {

        //The imagePath variable will set the path of the image
        let imagePath = `./images-to-convert/${image}`

        //The variable imageName will save the name from the original file
        let imageName = image.split('.')[0]

        //It will convert imagePath and save the converted file into the 'converted-to-webp' folder keeping the original file name
        webp.cwebp(imagePath, `./converted-to-webp/${imageName}.webp`, "-q 100", function (status, error) {
            //The log will print 100 to success or 101 to failed conversion
            console.log(status, error);
        });
    });

});