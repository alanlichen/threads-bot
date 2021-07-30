import fss from 'fs';
import fs from 'fs/promises';
import path from 'path';
import sql from './util/db.js';
import logger from './util/logger.js';

export interface ServerSettings {
    enabledChannels: Record<string, string>;
}

const defaultSettings: ServerSettings = {
    enabledChannels: {},
};

export async function settingsInitialize() {
    await sql.unsafe(`
        create table if not exists settings
        (
            "serverid"     text not null primary key,
            serversettings text
        );

        comment on column settings.serverid is 'The id of the server';
        comment on column settings.serversettings is 'A stringified json object of the server settings';
    `)

    logger.info('Database initialized');
}

export async function settingsGet(serverId: string): Promise<ServerSettings> {
    const [res] = await sql<{
        serversettings?: string;
    }[]>/*sql*/`SELECT serversettings
                FROM settings
                WHERE serverid = ${serverId}`;
    logger.debug(res);
    if (!res) return defaultSettings;
    return JSON.parse(res.serversettings!);
}

export async function settingsSet(
    serverId: string,
    newSettings: ServerSettings
): Promise<void> {
    await sql`
        INSERT INTO settings (serverid, serversettings)
        VALUES (${serverId}, ${JSON.stringify(newSettings)})
        ON CONFLICT on constraint settings_pkey DO UPDATE
            SET serversettings = EXCLUDED.serversettings
    `;
}
