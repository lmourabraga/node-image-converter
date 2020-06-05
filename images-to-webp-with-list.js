const fs = require('fs');
const webp = require('webp-converter'); //Read more: https://www.npmjs.com/package/webp-converter#how-to-use
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

//It will use the csv-writer library to generate a csv file listing the images which could not be converted
const csvWriter = createCsvWriter({
    path: './csv/failed-to-webp.csv',
    header: [{
        id: 'NAME',
        title: 'NAME'
    }]
});

const failedImages = [];

let brokenImage = {};

const originalPath = './images-to-convert';
const finalPath = './converted-to-webp';

function run() {
    //Selects the folder 'image-to-convert' and put each file name + extension inside of it into an array we will call images
    fs.readdir(originalPath, function (error, images) {

        //forEach loop will go thought each image to convert
        images.forEach((image, index) => {
            setTimeout(() => {
                //The imagePath variable will set the path of the image
                let imagePath = `${originalPath}/${image}`

                //The variable imageName will save the name from the original file
                let imageName = image.split('.')[0]

                //It will convert imagePath and save the converted file into the 'converted-to-webp' folder keeping the original file name
                webp.cwebp(imagePath, `${finalPath}/${imageName}.webp`, "-q 100", function (status) {

                    //The system will return 100 to success or 101 to failed conversion
                    if (status == 101) {
                        console.log(`${index+1} of ${images.length} | ${imageName}.jpg has failed to conversion.`);

                        brokenImage.NAME = imageName;

                        //It will push the corrupted file to array
                        failedImages.push(brokenImage);

                        //If loop has finished
                        if (index + 1 == images.length) {
                            //Call the function to generate the csv file.
                            generateCsv();
                        }
                    } else {
                        //Deletes the original file if the conversion had been completed
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            } else {
                                console.log(`${index+1} of ${images.length} | ${imageName}.jpg was converted successfully to .webp and moved to the path: ${finalPath}`);
                            }
                        });
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
    console.log('Almost finishing...');
    csvWriter.writeRecords(failedImages)
        .then(() => {
            console.log('Conversion done! A CSV file was created at ./csv/ with a list of images which could not be converted.');
        });
}