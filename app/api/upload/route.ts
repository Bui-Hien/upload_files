import {NextResponse} from 'next/server';
import {google} from 'googleapis';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';
import type {NextRequest} from 'next/server';

async function authorize() {
    const jwtClient = new google.auth.JWT(
        "uploadfiles@stone-poetry-405108.iam.gserviceaccount.com",
        undefined,
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCv+18Hw2ASrOCl\nPwVcHMG3lIa7Zqwd7D0tDg0xpBIYC2qDT5DPda8wy8uNXCgYt1kqQcjc7da3tWzj\nBHxmGHsr/lB18wDHvFfaFqumHMmuAqT9DmL/v9uqzD6RnbeHcpKrRDThKvhtV74S\nhPKJwUkvJgyOJjndlnzmV2HiEnNcGQJvW4z21B7JCVsKiZcN5VWKOzueWkb+MjDn\naAmJ4xofu4lwnCfa2xMn/dB+bLO9oeNkkBP8je39sQIDgyaHZNkdvA0ad6ow/SPB\nkn8raGfOYLIcjWqjn8BDnzSYknw2jzXdGqKn8pjxoT9Em7rlWDnf00Yeu0BAnnXF\nijgfBvC9AgMBAAECggEANMPH8InyCmdvS9yjfMTaiHKuGw5j2Oz2QsYNyq6JBlCV\n9R0sLCf7CURxmcbh9tcykur6kNN3J8nsBf1YVzxL4hr0gQkFWN3t8WQOv1WuWtBM\nK9vebxRVhtaKhBqn5qLBuzxOJp09s3s1cFQQbKFZkht0dEKd4wS2GlJk9OXXVOtj\nbnbfh40lT1HFRGLatpY4cp8VKGFWFPYQDmn/7OJPt6vwUioi+OnnjQkjqFBqbLN4\nTXCoGuLt+Y1BXep0N+BcJr1jwAOghmRHKMhIXJdwVCqphEi5j12133iPJDKZA6mb\nLY0A4Nvmmhj1awrba75ukyS0JUqzQhKciFJvZHfzeQKBgQDZz7FWVACqzts3UnGv\nINQhmZ/VW8IyKYKsH1lj1s696eV+BJI/VT2Tym345ml6PvNG3I2hzyk33WPljOmP\n4vTvV4xRrYUTUaskQTrgX2tdne4oYo5v1+uyJJfxZ8wekAQsDZAKF1F41RwwKldc\n44s/fXIlOkPgkTnTGoas6pZVzwKBgQDO1jIzHOpe/wM3umJ9ap5prrEHXwpvXxfV\nZHh0x+vV1v8v5ig4/sOcgoa9ViRiXLTaEEu/VcRGBu7GzVEL/oFRdm9haPFvlGYe\nfn/jUArxE5CBqbU3m/PFnjpgVlnaWeDbE8eWYMfMriBVOB+l9z/8KWDZ49R28Wuw\nTydmiEU/swKBgHtZDTqwU7hncOnBfLQKyVdF4qg3UKCLtX64Oi06JtaSMO7Os+u9\n4CNkDidYhP8/yxGkMWkjIlqKu9nxlQtxIfixAbv3olcwdtUPQ8JxByJ7H7YrKjLY\nepfl9U420/ey40n3XEz6q57cQRxdvh/SlLcd2ZiPiIUSeUa9zOr75qstAoGARpjj\nn4CSGoSOM5pBfa9DjKzcrbhp1mOtvd9CIhIO0/lDNrUnK3UBjU0b8koRtyUPcZK4\nWAFNMd2x6Fcx/5cJyqVTFPt91OjhBi2FNzAd2/UikK89NFLdnKkKIdG3b4jX787L\ng+9aoukYDh5O5xYCV+5DqXtTDJoQeKg7uYpvoHMCgYEAwX/REvCk44X2ZImzpW0K\nbtlp/DpWeHJ69vApsmD8JnoazL4BuoDgsdyapuNL+9J42sY9/JWBdVMWZXhk3tmq\nZ88O/CLo5nDqWToE9sAgdP/8lZ/g8MA3I+gWna20qfz2UlrhtislzYreivYgBCmG\n+uxY81saQ5S+U/JhfzYhbDo=\n-----END PRIVATE KEY-----\n"
        ,
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
        parents: ["1F7WlZqMuxU6UdfKDp7qQZBbYYUF2Udi1"] // Folder ID from environment variable
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
        const {fileId, fileLink} = await uploadFile(authClient, fileBuffer, randomFileName, file.type); // Use randomFileName for upload
        return NextResponse.json({fileLink});
    } catch (error) {
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Unknown error occurred';
        return NextResponse.json({error: errorMessage}, {status: 500});
    }
}
