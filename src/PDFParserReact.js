import React, { useState } from 'react';
import './PDFParserReact.css'; // Import CSS file for styling

// Function to extract text and coordinates from the PDF
function extractTextAndCoordinates(event, setTextAndCoordinates) {
    // Extract the selected file from the file input event
    const file = event.target.files[0];
    // Create a new instance of the FileReader object to read the contents of the selected file
    const reader = new FileReader();
    // When the file reading operation is completed, execute this asynchronous function
    reader.onload = async function() {
        // Retrieve the file content as an array buffer after it has been read
        const arrayBuffer = reader.result;
        // Asynchronously load the PDF document using the pdfjsLib library and the array buffer obtained from the file reading operation
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        // Asynchronously extract text and coordinates from the PDF document
        const textAndCoordinates = await extractTextAndCoordinatesFromPDF(pdf);
        // Update the component state with the extracted text and coordinates
        setTextAndCoordinates(textAndCoordinates);
    };
    // Start reading the contents of the selected file as an array buffer
    reader.readAsArrayBuffer(file);
}

// Function to extract text and coordinates from the PDF document
async function extractTextAndCoordinatesFromPDF(pdf) {
    // Initialize an empty array to store extracted text and coordinates
    const textAndCoordinates = [];
    // Iterate through each page of the PDF document
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        // Asynchronously retrieve a specific page of the PDF document
        const page = await pdf.getPage(pageNumber);
        // Asynchronously retrieve the text content of the page
        const textContent = await page.getTextContent();
        // Extract the text items from the text content
        const textItems = textContent.items;
        // Iterate through each text item on the page
        textItems.forEach(item => {
            // Extract text and coordinates
            const text = item.str; // Extract the text content of the text item
            const { transform } = item; // Extract the transformation matrix from the text item
            const x = transform[4]; // X coordinate
            const y = transform[5]; // Y coordinate
            // Add an object containing the extracted text and coordinates to the textAndCoordinates array
            textAndCoordinates.push({ text, x, y });
        });
    }
    return textAndCoordinates;// it returns the text and the coordinate when the function is called 
}

// PDFParserReact component
function PDFParserReact() {  // this is our componment to be rendered 
    // State to store extracted text and coordinates
    const [textAndCoordinates, setTextAndCoordinates] = useState([]); // here is the state to store our text and coordinate 

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">PDF Text and Coordinates Extractor</h1>
                {/* File input for selecting the PDF file */}
                <input type="file" accept="application/pdf" onChange={(event) => extractTextAndCoordinates(event, setTextAndCoordinates)}/>
            </header>
            <div className="text-container">
                <h2 className="subtitle">Extracted Text and Coordinates:</h2>
                <div className="table-container">
                    {/* Table to display extracted text and coordinates */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Text</th>
                                <th>X Coordinate</th>
                                <th>Y Coordinate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map through textAndCoordinates array to render each row */}
                            {textAndCoordinates.map(({ text, x, y }, index) => (
                                <tr key={index}>
                                    <td>{text}</td>
                                    <td>{x}</td>
                                    <td>{y}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PDFParserReact;
