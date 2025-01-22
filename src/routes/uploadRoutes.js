import * as path from "path";
import { dirname } from 'path';
import pump from "pump";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import fs from 'fs';
import { pipeline } from "stream/promises";
const __dirname = dirname(__filename);
// import  pipeline from 'node:stream/promises';

export const uploadRoutes = async (app) => {
    app.post('/upload', async (req, reply) => {
        const file = req.body.file; // Access the file directly from req.body
        
        if (!file) {
          return reply.code(400).send({ error: 'No file uploaded' });
        }

        const size = file && file._buf ? file._buf.length : null;

        const { filename, mimetype } = file;
      
        // Validate file type
        if (mimetype !== 'application/zip') {
          return reply.code(400).send({ error: 'Only .zip files are allowed.' });
        }
      
        // Access other fields from req.body
        const { boxType, version, packageType } = req.body;
      
        const uploadDirectory = path.resolve(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDirectory)) {
            // Create the uploads directory if it doesn't exist
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        // Prepare file path and save it
        const filePath = path.join(uploadDirectory, filename);
      
        try {
          if (typeof file.file.pipe === 'function') {
            await pipeline(file.file, fs.createWriteStream(filePath));  // Write the stream to disk
          } else if (Buffer.isBuffer(file.file)) {
            // If it's a buffer, use writeFileSync
            fs.writeFileSync(filePath, file.file);
          }
          const creationTimeUTC = new Date().toISOString().slice(0, 19).replace('T', ' ');


          // Insert details into MySQL database (example query)
          const query = `
            INSERT INTO uploads (fileName, size, boxType, version, packageType, creation_time_UTC, versionNum, creator)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
            filename,           // fileName
            size,               // size
            parseInt(boxType.value),            // boxType
            version.value,            // version
            parseInt(packageType.value),        // packageType
            creationTimeUTC,    // creation_time_UTC
            '27',               // versionNum
            'admin'             // creator
            ];
      
          // Execute the query
          await app.mysql.query(query, values);
      
          reply.code(200).send({
            message: 'File uploaded and saved to the database successfully.',
          });
        } catch (err) {
          console.log('UPLOAD ERROR: ', err);
          reply.code(500).send({ error: 'An error occurred while processing the file.' });
        }
    });
    app.get('/uploads', async (req, reply) => {
        // fastify.mysql.getConnection(onConnect);
        try {
            // Query to fetch all uploads
            const [uploads] = await app.mysql.query(
                'SELECT * FROM uploads ORDER BY creation_time_UTC DESC'
            );

            // Get the latest version for each boxType (0 and 1)
            const latestVersions = {};
      
            for (let boxType = 0; boxType <= 1; boxType++) {
                const latestVersionQuery = 'SELECT MAX(versionNum) AS latestVersion FROM uploads WHERE boxType = ?';
                const [latestVersionResult] = await app.mysql.query(latestVersionQuery, [boxType]);
        
                const latestVersion = latestVersionResult[0]?.latestVersion || 0;
                latestVersions[`latestVersionBoxType${boxType}`] = latestVersion;
            }
      
          // Return the response with all records and the latest version for each boxType
          reply.send({
            data: uploads,
            ...latestVersions, // Spread the latest version data for both boxTypes
          });
        } catch (error) {
          console.error('Error fetching uploads:', error);
          reply.status(500).send({ error: 'Failed to fetch uploads' });
        }
    });
    app.delete('/upload/:id', async (req, reply) => {
        const { id } = req.params;
    
        try {
            // Fetch the record to get the file details
            const [rows] = await app.mysql.query('SELECT fileName FROM uploads WHERE id = ?', [id]);
    
            if (rows.length === 0) {
                return reply.code(404).send({ error: 'File not found' });
            }
    
            const { fileName } = rows[0];
    
            // Define the file path
            const uploadDirectory = path.resolve(__dirname, '../../uploads');
            const filePath = path.join(uploadDirectory, fileName);
    
            // Delete the file from the filesystem
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            // Delete the record from the database
            await app.mysql.query('DELETE FROM uploads WHERE id = ?', [id]);
    
            reply.code(200).send({
                error: 0,
                message: 'File deleted successfully.',
            });
        } catch (error) {
            console.error('DELETE ERROR:', error);
            reply.code(500).send({ error: 'An error occurred while deleting the file.' });
        }
    });    
}