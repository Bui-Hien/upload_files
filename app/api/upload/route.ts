import {NextResponse} from 'next/server';
import {google} from 'googleapis';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';
import type {NextRequest} from 'next/server';

async function authorize() {
    const jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL!,
        undefined,
        process.env.GOOGLE_PRIVATE_KEY!,
        ['https://www.googleapis.com/auth/drive']
    );
    try {
        await jwtClient.authorize();
        return jwtClient;
    } catch (error) {
        throw new Error('Failed to authorize with Google API');
    }
}

// Convert buffer to readable stream
function bufferToStream(buffer: Buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

// Upload file to Google Drive
async function uploadFile(authClient: any, fileBuffer: Buffer, filename: string, mimeType: string) {
    const drive = google.drive({version: 'v3', auth: authClient});

    const fileMetaData = {
        name: filename,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!] // Folder ID from environment variable
    };

    try {
        const response = await drive.files.create({
            requestBody: fileMetaData, // Corrected property name
            media: {
                mimeType: mimeType,
                body: bufferToStream(fileBuffer) // Convert buffer to stream
            },
            fields: 'id'
        });
        const fileId = response.data.id;
        const fileLink = `https://drive.google.com/file/d/${fileId}/view`;
        return {fileId, fileLink};
    } catch (error) {
        throw new Error('Failed to upload file to Google Drive');
    }
}

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
}

// Handle API request
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({error: 'No file provided'}, {status: 400});
    }

    // Generate a random filename with the same extension as the original file
    const fileExtension = file.name.split('.').pop();
    const randomFileName = `${uuidv4()}.${fileExtension}`;

    try {
        const authClient = await authorize();
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const {fileId, fileLink} = await uploadFile(authClient, fileBuffer, randomFileName, file.type);
        const response = NextResponse.json({fileLink});

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins, modify as needed
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error occurred';
        const response = NextResponse.json({error: errorMessage}, {status: 500});

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins, modify as needed
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    }
}
