const fs = require('fs');
const webp = require('webp-converter'); //Read more: https://www.npmjs.com/package/webp-converter#how-to-use
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//It will use the csv-writer library to generate a csv file listing the images which could not be converted
const csvWriter = createCsvWriter({
    path: './csv/corrupted-images-webp-to-image.csv',
    header: [{
        id: 'NAME',
        title: 'NAME'
    }]
});

const corruptedImages = [];

let brokenImage = {};

function run() {
    //Selects the folder 'convert-to-webp' and put each file name + extension inside of it into an array we will call images
    fs.readdir('converted-to-webp', function (error, images) {

        //forEach loop will go thought each image to convert
        images.forEach((image, index) => {
            setTimeout(() => {
                //The imagePath variable will set the path of the image
                let imagePath = `./converted-to-webp/${image}`

                //The variable imageName will save the name from the original file
                let imageName = image.split('.')[0]

                //It will convert imagePath and save the converted file into the 'converted-to-webp' folder keeping the original file name
                webp.dwebp(imagePath, `./converted-to-image/${imageName}.jpg`, "-o", function (status) {

                    //The system will return 100 to success or 101 to failed conversion
                    if (status == 101) {
                        console.log(`${index+1} of ${images.length} | ${imageName}.webp has failed to conversion. The original file is corrupted.`);

                        brokenImage.NAME = imageName;

                        //It will push the corrupted file to array
                        corruptedImages.push(brokenImage);

                        //If loop has finished
                        if (index + 1 == images.length) {
                            //Call the function to generate the csv file.
                            generateCsv();
                        }
                    } else {
                        console.log(`${index+1} of ${images.length} | ${imageName}.webp was converted successfully to .jpg!`);
                    }
                });
            }, 500 * index);
        });

    });
};

//Run the converter function
run();

//Function to generate the csv file
function generateCsv() {
    console.log('Starting recording...');
    csvWriter.writeRecords(corruptedImages)
        .then(() => {
            console.log('The csv file was created.');
        });
}