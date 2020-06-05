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

const corruptedImages = [];

let brokenImage = {};

function run() {
    //Selects the folder 'upload' and put each file name + extension inside of it into an array we will call images
    fs.readdir('./upload', function (error, images) {

        //forEach loop will go thought each image to convert
        images.forEach((image, index) => {
            setTimeout(() => {
                //The imagePath variable will set the path of the image
                let imagePath = `./upload/${image}`

                //The variable imageName will save the name from the original file
                let imageName = image.split('.')[0]

                //It will convert imagePath and save the converted file into the './upload/output' folder keeping the original file name
                webp.cwebp(imagePath, `./upload/output/${imageName}.webp`, "-q 100", function (status) {

                    //The system will return 100 to success or 101 to failed conversion
                    if (status == 101) {
                        console.log(`${index+1} of ${images.length} | ${imageName}.jpg has failed to conversion. The original file is corrupted.`);

                        brokenImage.NAME = imageName;

                        //It will push the corrupted file to array
                        corruptedImages.push(brokenImage);

                        //If loop has finished
                        if (index + 1 == images.length) {
                            //Call the function to generate the csv file.
                            generateCsv();
                        }
                    } else {
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            } else {
                                console.log(`${index+1} of ${images.length} | ${imageName}.jpg was converted successfully to .webp and moved to the path: ./upload/output`);
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
    console.log('Starting recording...');
    csvWriter.writeRecords(corruptedImages)
        .then(() => {
            console.log('The csv file was created.');
        });
}