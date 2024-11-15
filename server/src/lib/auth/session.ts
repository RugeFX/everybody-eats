import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "@/db";
import { User } from "@/types/database";

export function generateSessionToken() {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);

	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = await db
		.insertInto("session")
		.values({
			id: sessionId,
			user_id: userId,
			expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		})
		.returningAll()
		.executeTakeFirstOrThrow();

	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = await db
		.selectFrom("session")
		.innerJoin("user", "user.id", "session.user_id")
		.select([
			"session.id",
			"session.user_id",
			"session.expires_at",
			"user.username",
			"user.password",
			"user.email",
			"user.full_name",
			"user.role",
		])
		.where("session.id", "=", sessionId)
		.executeTakeFirst();

	if (session === undefined) {
		return null;
	}

	const user: User = {
		id: session.user_id,
		username: session.username,
		email: session.email,
		full_name: session.full_name,
		role: session.role,
		password: session.password,
	};

	if (Date.now() >= session.expires_at.getTime()) {
		await db.deleteFrom("session").where("id", "=", session.id).execute();

		return null;
	}

	if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

		await db
			.updateTable("session")
			.set("expires_at", expiresAt)
			.where("id", "=", session.id)
			.execute();
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string) {
	await db.deleteFrom("session").where("id", "=", sessionId).execute();
}
