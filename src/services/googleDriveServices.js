// =========================================================
// GOOGLE DRIVE SERVICE
// =========================================================

// Google OAuth Client ID for LIFE GAME.
const GOOGLE_CLIENT_ID =
    "966381076691-4p4qjf3li2u9q4671i3krsq3kqap9h76.apps.googleusercontent.com";

// Permission required to create and update LIFE GAME's backup file.
const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";

// Name of the backup file stored in Google Drive.
const BACKUP_FILE_NAME =
    "LIFE GAME Backup.json";

// Google Identity Services script URL.
const GOOGLE_IDENTITY_SCRIPT =
    "https://accounts.google.com/gsi/client";

// Google Drive API endpoint.
const DRIVE_API_URL =
    "https://www.googleapis.com/drive/v3";

// Google Drive upload endpoint.
const DRIVE_UPLOAD_URL =
    "https://www.googleapis.com/upload/drive/v3";

// =========================================================
// GOOGLE DRIVE REAUTH ERROR
// =========================================================

// Special error code used when a new Google token is required.
export const GOOGLE_DRIVE_REAUTH_REQUIRED =
    "GOOGLE_DRIVE_REAUTH_REQUIRED";

// =========================================================
// IN-MEMORY GOOGLE TOKEN
// =========================================================

// Current Google access token.
// This is intentionally kept only in memory.
let currentAccessToken = null;

// Time when the current access token expires.
let currentTokenExpiresAt = 0;

// Keep the OAuth token client in memory.
let tokenClient = null;

// Prevent loading Google Identity Services multiple times.
let googleScriptPromise = null;

// =========================================================
// LOAD GOOGLE IDENTITY SERVICES
// =========================================================

function loadGoogleIdentityServices() {
    // Reuse the existing script-loading promise.
    if (googleScriptPromise) {
        return googleScriptPromise;
    }

    // Google Identity Services is already available.
    if (window.google?.accounts?.oauth2) {
        return Promise.resolve();
    }

    // Load Google's Identity Services script.
    googleScriptPromise = new Promise(
        (resolve, reject) => {
            const script =
                document.createElement("script");

            script.src =
                GOOGLE_IDENTITY_SCRIPT;

            script.async = true;

            // Resolve when the Google script loads.
            script.onload = () => {
                resolve();
            };

            // Reject if the Google script cannot load.
            script.onerror = () => {
                reject(
                    new Error(
                        "Google Identity Services could not be loaded."
                    )
                );
            };

            document.head.appendChild(script);
        }
    );

    return googleScriptPromise;
}

// =========================================================
// SAVE ACCESS TOKEN IN MEMORY
// =========================================================

function storeAccessToken(response) {
    // Validate the Google response.
    if (!response?.access_token) {
        throw new Error(
            "Google did not return an access token."
        );
    }

    // Store the access token only in memory.
    currentAccessToken =
        response.access_token;

    // Google normally provides the token lifetime
    // through expires_in in seconds.
    const expiresInSeconds =
        Number(response.expires_in) || 3600;

    // Expire slightly early to avoid making an API
    // request with a token that is about to expire.
    currentTokenExpiresAt =
        Date.now() +
        Math.max(
            0,
            expiresInSeconds - 60
        ) *
        1000;

    // Return the token for immediate use.
    return currentAccessToken;
}

// =========================================================
// CHECK CURRENT TOKEN
// =========================================================

function hasValidAccessToken() {
    // A token is valid only if it exists and
    // has not reached its expiration time.
    return (
        Boolean(currentAccessToken) &&
        Date.now() <
        currentTokenExpiresAt
    );
}

// =========================================================
// CREATE TOKEN CLIENT
// =========================================================

function createTokenClient(callback) {
    // Create Google's OAuth token client.
    tokenClient =
        window.google.accounts.oauth2.initTokenClient({
            client_id:
                GOOGLE_CLIENT_ID,

            scope:
                GOOGLE_DRIVE_SCOPE,

            callback,
        });

    // Return the created client.
    return tokenClient;
}

// =========================================================
// CONNECT GOOGLE DRIVE
// =========================================================

export async function connectGoogleDrive() {
    // Make sure Google Identity Services is loaded.
    await loadGoogleIdentityServices();

    // Request a new token through a user-driven action.
    return new Promise(
        (resolve, reject) => {
            const client =
                createTokenClient(
                    (response) => {
                        // Handle Google's OAuth error.
                        if (
                            response?.error
                        ) {
                            reject(
                                new Error(
                                    response.error_description ||
                                    "Google Drive authorization failed."
                                )
                            );

                            return;
                        }

                        try {
                            // Save the new token in memory.
                            const accessToken =
                                storeAccessToken(
                                    response
                                );

                            // Return the token.
                            resolve(
                                accessToken
                            );
                        } catch (error) {
                            reject(error);
                        }
                    }
                );

            // Interactive authorization.
            // This function must only be called from
            // a user action such as a button click.
            client.requestAccessToken({
                prompt: "consent",
            });
        }
    );
}

// =========================================================
// GET CURRENT GOOGLE DRIVE ACCESS TOKEN
// =========================================================

export async function getGoogleDriveAccessToken() {
    // Do not perform OAuth automatically here.
    //
    // This is important because calling Google's
    // requestAccessToken() during app startup can
    // trigger a popup or violate Google's user-gesture
    // requirement.
    if (hasValidAccessToken()) {
        return currentAccessToken;
    }

    // The token is missing or expired.
    currentAccessToken = null;
    currentTokenExpiresAt = 0;

    // Tell the application that the user must reconnect.
    const error =
        new Error(
            "Google Drive needs reconnection."
        );

    error.code =
        GOOGLE_DRIVE_REAUTH_REQUIRED;

    throw error;
}

// =========================================================
// FIND EXISTING BACKUP FILE
// =========================================================

async function findBackupFile(
    accessToken
) {
    // Search for LIFE GAME's existing backup file.
    const query =
        encodeURIComponent(
            `name = '${BACKUP_FILE_NAME}' and trashed = false`
        );

    // Call the Google Drive files API.
    const response =
        await fetch(
            `${DRIVE_API_URL}/files?q=${query}&spaces=drive&corpora=user&fields=files(id,name)`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

    // Handle Google Drive API errors.
    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            "Google Drive search error:",
            response.status,
            errorText
        );

        throw new Error(
            `Google Drive file search failed (${response.status}).`
        );
    }

    // Parse the response.
    const result =
        await response.json();

    // Return the first matching backup file.
    return (
        result.files?.[0] ||
        null
    );
}

// =========================================================
// CREATE BACKUP FILE
// =========================================================

async function createBackupFile(
    accessToken,
    backup
) {
    // Metadata for the new Google Drive file.
    const metadata = {
        name:
            BACKUP_FILE_NAME,

        mimeType:
            "application/json",
    };

    // Convert the database backup to JSON.
    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    // Multipart upload boundary.
    const boundary =
        "-------life-game-google-drive-boundary";

    // Construct the multipart request body.
    const body =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${json}\r\n` +
        `--${boundary}--`;

    // Upload the new backup file.
    const response =
        await fetch(
            `${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,

                    "Content-Type":
                        `multipart/related; boundary=${boundary}`,
                },

                body,
            }
        );

    // Handle upload errors.
    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            "Google Drive backup creation error:",
            response.status,
            errorText
        );

        throw new Error(
            `Google Drive backup creation failed (${response.status}).`
        );
    }

    // Return Google Drive's response.
    return response.json();
}

// =========================================================
// UPDATE BACKUP FILE
// =========================================================

async function updateBackupFile(
    accessToken,
    fileId,
    backup
) {
    // Convert the backup to JSON.
    const json =
        JSON.stringify(
            backup,
            null,
            2
        );

    // Replace the existing file's contents.
    const response =
        await fetch(
            `${DRIVE_UPLOAD_URL}/files/${fileId}?uploadType=media`,
            {
                method: "PATCH",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,

                    "Content-Type":
                        "application/json",
                },

                body: json,
            }
        );

    // Handle update errors.
    if (!response.ok) {
        const errorText =
            await response.text();

        console.error(
            "Google Drive backup update error:",
            response.status,
            errorText
        );

        throw new Error(
            `Google Drive backup update failed (${response.status}).`
        );
    }

    // Return Google Drive's response.
    return response.json();
}

// =========================================================
// BACKUP DATABASE TO GOOGLE DRIVE
// =========================================================

export async function backupToGoogleDrive(
    accessToken,
    backup
) {
    // Look for the existing LIFE GAME backup.
    const existingFile =
        await findBackupFile(
            accessToken
        );

    // Create the backup if it does not exist.
    if (!existingFile) {
        return createBackupFile(
            accessToken,
            backup
        );
    }

    // Otherwise update the existing backup.
    return updateBackupFile(
        accessToken,
        existingFile.id,
        backup
    );
}

// =========================================================
// PUBLIC GOOGLE DRIVE BACKUP FUNCTION
// =========================================================

export async function createGoogleDriveBackup(
    backup
) {
    // Get only the currently valid in-memory token.
    //
    // This function NEVER opens Google's OAuth popup.
    const accessToken =
        await getGoogleDriveAccessToken();

    // Upload/update the backup.
    return backupToGoogleDrive(
        accessToken,
        backup
    );
}

// =========================================================
// GOOGLE DRIVE CONSTANTS
// =========================================================

export {
    BACKUP_FILE_NAME,
};